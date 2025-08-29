import { useEffect, useMemo, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { DocumentText } from "@medusajs/icons"
import { Badge, Button, Input, Select, Table, Text } from "@medusajs/ui"
import { sdk } from "../../lib/sdk"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

export type Blog = {
  id: string
  category_id: string
  title: string
  image_url?: string | null
  short_description?: string | null
  content: string
  hashtags?: string[] | { tags: string[] } | null
  read_time?: number | null
  created_at: string
}

export type BlogCategory = {
  id: string
  name: string
}

const limit = 15

// Lightweight modal to avoid relying on @medusajs/ui Modal export
const SimpleModal: React.FC<{
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}> = ({ open, onOpenChange, title, children, footer }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-md bg-ui-bg-base text-ui-fg-base shadow-lg border border-ui-border-base">
          <div className="flex items-center justify-between border-b border-ui-border-base px-4 py-3">
            <h3 className="text-base font-semibold">{title}</h3>
            <button className="text-ui-fg-subtle hover:text-ui-fg-base" onClick={() => onOpenChange(false)}>×</button>
          </div>
          <div className="p-4 max-h-[70vh] overflow-auto">{children}</div>
          <div className="flex items-center justify-end gap-2 border-t border-ui-border-base px-4 py-3">
            {footer}
          </div>
        </div>
      </div>
    </div>
  )
}

const BlogsPage = () => {
  const [pageIndex, setPageIndex] = useState(0)
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [q, setQ] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Blog | null>(null)
  const [saving, setSaving] = useState(false)
  const [actingId, setActingId] = useState<string | null>(null)

  const [form, setForm] = useState({
    category_id: "",
    title: "",
    image_url: "" as string | null,
    short_description: "",
    content: "",
    hashtags: [] as string[],
    tagInput: "",
    read_time: 0,
  })

  const offset = useMemo(() => pageIndex * limit, [pageIndex])

  // Fetch categories for dropdowns
  const { data: catData } = useQuery<{ categories: BlogCategory[] }>({
    queryKey: ["admin-blog-categories-all"],
    queryFn: async () => {
      const res = await sdk.client.fetch("/admin/blog-categories", { query: { limit: 200, order: "-created_at" } })
      return res as any
    },
  })

  const { data, isLoading, refetch } = useQuery<{ blogs: Blog[]; count: number; limit: number; offset: number }>({
    queryKey: ["admin-blogs", offset, limit, categoryFilter, q],
    queryFn: () =>
      sdk.client.fetch("/admin/blogs", {
        query: {
          offset,
          limit,
          order: "-created_at",
          ...(categoryFilter ? { category_id: categoryFilter } : {}),
          ...(q ? { q } : {}),
        },
      }),
  })

  const total = data?.count || 0
  const pageCount = Math.max(1, Math.ceil(total / limit))

  useEffect(() => {
    if (!showForm) {
      setEditing(null)
      setForm({ category_id: "", title: "", image_url: "", short_description: "", content: "", hashtags: [], tagInput: "", read_time: 0 })
    }
  }, [showForm])

  const openCreate = () => {
    setEditing(null)
    setShowForm(true)
  }

  const openEdit = (b: Blog) => {
    const tags = Array.isArray(b.hashtags) ? b.hashtags : (b.hashtags && (b.hashtags as any).tags) ? (b.hashtags as any).tags : []
    setEditing(b)
    setForm({
      category_id: b.category_id,
      title: b.title,
      image_url: b.image_url || "",
      short_description: b.short_description || "",
      content: b.content,
      hashtags: tags,
      tagInput: "",
      read_time: b.read_time || 0,
    })
    setShowForm(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setForm((f) => ({ ...f, image_url: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const addTag = () => {
    const t = (form.tagInput || "").trim()
    if (!t) return
    if (form.hashtags.includes(t)) return
    setForm((f) => ({ ...f, hashtags: [...f.hashtags, t], tagInput: "" }))
  }

  const removeTag = (tag: string) => {
    setForm((f) => ({ ...f, hashtags: f.hashtags.filter((t) => t !== tag) }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.category_id || !form.content.trim()) {
      alert("Please fill Title, Category and Content")
      return
    }
    try {
      setSaving(true)
      const payload: any = {
        category_id: form.category_id,
        title: form.title.trim(),
        image_url: form.image_url || null,
        short_description: form.short_description?.trim() || null,
        content: form.content,
        hashtags: form.hashtags,
        read_time: Number(form.read_time) || 0,
      }
      if (editing) {
        await sdk.client.fetch(`/admin/blogs/${editing.id}`, { method: "PATCH", body: payload })
      } else {
        await sdk.client.fetch(`/admin/blogs`, { method: "POST", body: payload })
      }
      setShowForm(false)
      await refetch()
    } catch (e) {
      console.error(e)
      alert("Failed to save blog")
    } finally {
      setSaving(false)
    }
  }

  const queryClient = useQueryClient()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return
    
    const originalBlogs = queryClient.getQueryData<{ blogs: Blog[]; count: number }>(["admin-blogs", offset, limit, categoryFilter, q])
    
    try {
      setActingId(id)
      
      // Optimistic update
      if (originalBlogs) {
        queryClient.setQueryData(
          ["admin-blogs", offset, limit, categoryFilter, q],
          {
            ...originalBlogs,
            blogs: originalBlogs.blogs.filter(blog => blog.id !== id),
            count: originalBlogs.count - 1
          }
        )
      }
      
      // Make the API call with fetch directly to avoid SDK issues
      const response = await fetch(`/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Get the auth token from localStorage if needed
          'Authorization': `Bearer ${localStorage.getItem('medusa_auth_token') || ''}`
        },
        credentials: 'include'
      });
      
      // Check if the request was successful (2xx status code)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
    } catch (e) {
      console.error('Delete error:', e);
      
      // Revert optimistic update on error
      if (originalBlogs) {
        queryClient.setQueryData(
          ["admin-blogs", offset, limit, categoryFilter, q],
          originalBlogs
        )
      }
      
      alert("Failed to delete blog. Please try again.");
    } finally {
      setActingId(null);
    }
  }

  const categoryName = (id: string) => (catData?.categories || []).find((c) => c.id === id)?.name || id

  return (
    <div className="p-6">
      {/* Quill editor theme overrides to match Medusa UI (monochrome) */}
      <style>{`
        .quill-monochrome .ql-toolbar {
          background: var(--ui-bg-base);
          color: var(--ui-fg-base);
          border-color: var(--ui-border-base);
        }
        .quill-monochrome .ql-toolbar .ql-picker, 
        .quill-monochrome .ql-toolbar button {
          color: var(--ui-fg-base);
        }
        .quill-monochrome .ql-container {
          background: var(--ui-bg-subtle);
          color: var(--ui-fg-base);
          border-color: var(--ui-border-base);
        }
        .quill-monochrome .ql-editor {
          min-height: 10rem;
        }
      `}</style>
      <div className="mb-4 flex flex-col gap-3">
        <h1 className="text-xl font-semibold">Blogs</h1>
        <div className="flex items-center gap-2 overflow-x-auto flex-nowrap">
          <div className="shrink-0">
          <Select value={categoryFilter || undefined} onValueChange={(v) => setCategoryFilter(v)}>
            <Select.Trigger>
              <Select.Value placeholder="All categories" />
            </Select.Trigger>
            <Select.Content className="z-[60]">
              {(catData?.categories || []).map((c) => (
                <Select.Item key={c.id} value={c.id}>{c.name}</Select.Item>
              ))}
            </Select.Content>
          </Select>
          </div>
          <Input className="min-w-[200px]" placeholder="Search..." value={q} onChange={(e) => setQ((e.target as HTMLInputElement).value)} />
          <Button className="shrink-0 whitespace-nowrap" size="small" variant="secondary" onClick={() => { setPageIndex(0); refetch() }}>Filter</Button>
          <Button className="shrink-0 whitespace-nowrap" size="small" onClick={openCreate}>Add Blog</Button>
        </div>
      </div>

      <div className="overflow-x-auto border rounded">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Image</Table.HeaderCell>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Category</Table.HeaderCell>
              <Table.HeaderCell>Read Time</Table.HeaderCell>
              <Table.HeaderCell>Created</Table.HeaderCell>
              <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading && (
              <Table.Row>
                <Table.Cell colSpan={6}>Loading...</Table.Cell>
              </Table.Row>
            )}
            {!isLoading && (data?.blogs?.length || 0) === 0 && (
              <Table.Row>
                <Table.Cell colSpan={6}>
                  <div className="py-8 text-center">
                    <Text className="mb-2">No Blogs Yet</Text>
                    <Button size="small" onClick={openCreate}>Create your first blog</Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
            {(data?.blogs || []).map((b) => (
              <Table.Row key={b.id}>
                <Table.Cell>
                  {b.image_url ? (
                    <img src={b.image_url} alt={b.title} className="h-10 w-16 object-cover rounded border border-ui-border-base bg-ui-bg-base" />
                  ) : (
                    <div className="h-10 w-16 rounded border border-ui-border-base bg-ui-bg-subtle" />
                  )}
                </Table.Cell>
                <Table.Cell>{b.title}</Table.Cell>
                <Table.Cell>{categoryName(b.category_id)}</Table.Cell>
                <Table.Cell>{b.read_time ? `${b.read_time} min` : "-"}</Table.Cell>
                <Table.Cell>{new Date(b.created_at).toLocaleString()}</Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="small" variant="secondary" onClick={() => openEdit(b)}>Edit</Button>
                    <Button size="small" variant="danger" onClick={() => handleDelete(b.id)} disabled={actingId === b.id}>
                      {actingId === b.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Text size="small">Page {pageIndex + 1} of {pageCount} • Total {total}</Text>
        <div className="flex gap-2">
          <Button size="small" disabled={pageIndex === 0} onClick={() => setPageIndex((p) => Math.max(0, p - 1))}>Previous</Button>
          <Button size="small" disabled={pageIndex + 1 >= pageCount} onClick={() => setPageIndex((p) => p + 1)}>Next</Button>
        </div>
      </div>
      <SimpleModal
        open={showForm}
        onOpenChange={setShowForm}
        title={editing ? "Edit Blog" : "Add Blog"}
        footer={(
          <>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" form="blog-form" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </>
        )}
      >
        <form id="blog-form" onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Category</label>
              <Select value={form.category_id || undefined} onValueChange={(v) => setForm((f) => ({ ...f, category_id: v }))}>
                <Select.Trigger>
                  <Select.Value placeholder="Select a category" />
                </Select.Trigger>
                <Select.Content className="z-[60]">
                  {(!catData && (
                    <Select.Item value="__loading__" disabled>Loading...</Select.Item>
                  )) || null}
                  {(catData?.categories?.length ? catData.categories : []).map((c) => (
                    <Select.Item key={c.id} value={c.id}>{c.name}</Select.Item>
                  ))}
                  {(catData && (!catData.categories || catData.categories.length === 0)) && (
                    <Select.Item value="__none__" disabled>No categories found</Select.Item>
                  )}
                </Select.Content>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Title</label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: (e.target as HTMLInputElement).value }))} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Upload Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
            <div className="flex items-end">
              {form.image_url ? (
                <img src={form.image_url} alt="preview" className="h-16 w-24 object-cover rounded border border-ui-border-base bg-ui-bg-base" />
              ) : (
                <div className="h-16 w-24 rounded border border-ui-border-base bg-ui-bg-subtle" />
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Short Description</label>
              <textarea className="w-full border rounded p-2 h-20" maxLength={200} value={form.short_description}
                onChange={(e) => setForm((f) => ({ ...f, short_description: (e.target as HTMLTextAreaElement).value }))} />
              <Text size="small" className="text-gray-500">{(form.short_description || "").length}/200</Text>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Content</label>
              <div className="quill-monochrome rounded border border-ui-border-base">
                <ReactQuill
                  theme="snow"
                  value={form.content}
                  onChange={(val: string) => setForm((f) => ({ ...f, content: val }))}
                  placeholder="Write your blog content..."
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Hashtags</label>
              <div className="flex gap-2">
                <Input placeholder="#tag" value={form.tagInput}
                  onChange={(e) => setForm((f) => ({ ...f, tagInput: (e.target as HTMLInputElement).value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                />
                <Button type="button" size="small" onClick={addTag}>Add</Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {form.hashtags.map((t) => (
                  <Badge key={t} rounded>
                    <div className="flex items-center gap-2">
                      <span>#{t}</span>
                      <button type="button" className="text-xs text-red-600" onClick={() => removeTag(t)}>×</button>
                    </div>
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Read Time (min)</label>
              <Input type="number" min={0} value={form.read_time}
                onChange={(e) => setForm((f) => ({ ...f, read_time: Number((e.target as HTMLInputElement).value) }))} />
            </div>
          </div>
        </form>
      </SimpleModal>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Blogs",
  icon: DocumentText,
})

export default BlogsPage
