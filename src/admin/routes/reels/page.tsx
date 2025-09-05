import { useEffect, useMemo, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Badge, Button, Input, Select, Table, Text } from "@medusajs/ui"
import { sdk } from "../../lib/sdk"

export type Reel = {
  id: string
  type: "video" | "image"
  name: string
  hashtags?: string[] | { tags: string[] } | null
  thumbnail_url?: string | null
  video_url?: string | null
  product_id?: string | null
  blog_id?: string | null
  is_display_home?: boolean
  created_at: string
}

const limit = 15

// Lightweight modal
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

const ReelsPage = () => {
  const [pageIndex, setPageIndex] = useState(0)
  const [typeFilter, setTypeFilter] = useState<string>("")
  const [productIdFilter, setProductIdFilter] = useState("")
  const [blogIdFilter, setBlogIdFilter] = useState("")
  const [q, setQ] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [form, setForm] = useState({
    type: "image" as "video" | "image",
    name: "",
    hashtags: [] as string[],
    tagInput: "",
    product_id: "",
    blog_id: "",
    thumbnail_url: "" as string | null,
    thumbnail_file: null as File | null,
    video_url: "" as string | null,
    video_file: null as File | null,
    is_display_home: false,
  })

  const offset = useMemo(() => pageIndex * limit, [pageIndex])

  const { data, isLoading, refetch } = useQuery<{ reels: Reel[]; count: number; limit: number; offset: number }>({
    queryKey: ["admin-reels", offset, limit, typeFilter, productIdFilter, blogIdFilter, q],
    queryFn: () =>
      sdk.client.fetch("/admin/reels", {
        query: {
          offset,
          limit,
          order: "-created_at",
          ...(typeFilter ? { type: typeFilter } : {}),
          ...(productIdFilter ? { product_id: productIdFilter } : {}),
          ...(blogIdFilter ? { blog_id: blogIdFilter } : {}),
          ...(q ? { q } : {}),
        },
      }),
  })

  const total = data?.count || 0
  const pageCount = Math.max(1, Math.ceil(total / limit))

  useEffect(() => {
    if (!showForm) {
      setForm({ type: "image", name: "", hashtags: [], tagInput: "", product_id: "", blog_id: "", thumbnail_url: "", thumbnail_file: null, video_url: "", video_file: null })
    }
  }, [showForm])

  const addTag = () => {
    const t = (form.tagInput || "").trim()
    if (!t) return
    if (form.hashtags.includes(t)) return
    setForm((f) => ({ ...f, hashtags: [...f.hashtags, t], tagInput: "" }))
  }

  const removeTag = (tag: string) => {
    setForm((f) => ({ ...f, hashtags: f.hashtags.filter((t) => t !== tag) }))
  }

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setForm((f) => ({ ...f, thumbnail_file: file }))
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setForm((f) => ({ ...f, video_file: file }))
  }

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const fd = new FormData()
      fd.append("files", file, file.name)
      const base = (import.meta as any).env?.VITE_MEDUSA_ADMIN_BASE_URL || "http://localhost:9000"
      const resp = await fetch(`${base}/admin/uploads`, { method: "POST", credentials: "include", body: fd })
      if (!resp.ok) {
        const raw = await resp.text().catch(() => "")
        console.error("Upload error", resp.status, raw)
        return null
      }
      const res: any = await resp.json().catch(() => null)
      const upload = res?.uploads?.[0] || res?.files?.[0] || res?.file || (Array.isArray(res) ? res[0] : null)
      const url = upload?.url || upload?.location || upload?.file?.url || null
      return url || null
    } catch (e) {
      console.error("Upload failed", e)
      return null
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      alert("Please provide a name")
      return
    }
    if (form.type === "video" && !form.video_file && !form.video_url) {
      alert("Please upload a video or provide a video URL")
      return
    }

    try {
      setSaving(true)
      let thumbnailUrl = form.thumbnail_url
      let videoUrl = form.video_url

      if (form.thumbnail_file) {
        const url = await uploadFile(form.thumbnail_file)
        if (!url) {
          alert("Thumbnail upload failed")
        } else {
          thumbnailUrl = url
        }
      }

      if (form.type === "video" && form.video_file) {
        const url = await uploadFile(form.video_file)
        if (!url) {
          alert("Video upload failed")
        } else {
          videoUrl = url
        }
      }

      const payload: any = {
        type: form.type,
        name: form.name.trim(),
        hashtags: form.hashtags,
        thumbnail_url: thumbnailUrl || null,
        video_url: form.type === "video" ? (videoUrl || null) : null,
        product_id: form.product_id?.trim() || null,
        blog_id: form.blog_id?.trim() || null,
        is_display_home: !!form.is_display_home,
      }

      if (editId) {
        await sdk.client.fetch(`/admin/reels/${editId}`, { method: "PATCH", body: payload })
      } else {
        await sdk.client.fetch(`/admin/reels`, { method: "POST", body: payload })
      }
      setShowForm(false)
      setEditId(null)
      await refetch()
    } catch (err) {
      console.error(err)
      alert("Failed to save reel")
    } finally {
      setSaving(false)
    }
  }

  const queryClient = useQueryClient()

  // Optional delete support if needed in future
  const [actingId, setActingId] = useState<string | null>(null)
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this reel?")) return
    const original = queryClient.getQueryData<{ reels: Reel[]; count: number }>(["admin-reels", offset, limit, typeFilter, productIdFilter, blogIdFilter, q])
    try {
      setActingId(id)
      if (original) {
        queryClient.setQueryData(["admin-reels", offset, limit, typeFilter, productIdFilter, blogIdFilter, q], {
          ...original,
          reels: original.reels.filter((r) => r.id !== id),
          count: original.count - 1,
        })
      }
      await fetch(`/admin/reels/${id}`, { method: "DELETE", credentials: "include" })
    } catch (e) {
      console.error(e)
      if (original) queryClient.setQueryData(["admin-reels", offset, limit, typeFilter, productIdFilter, blogIdFilter, q], original)
      alert("Failed to delete reel")
    } finally {
      setActingId(null)
    }
  }

  // Helpers for create/edit flows
  const resetForm = () => setForm({
    type: "image",
    name: "",
    hashtags: [],
    tagInput: "",
    product_id: "",
    blog_id: "",
    thumbnail_url: "",
    video_url: "",
    is_display_home: false,
    thumbnail_file: undefined as any,
    video_file: undefined as any,
  } as any)

  const startCreate = () => {
    setEditId(null)
    resetForm()
    setShowForm(true)
  }

  const openEdit = (r: Reel) => {
    setEditId(r.id)
    setForm((f) => ({
      ...f,
      type: r.type,
      name: r.name,
      hashtags: Array.isArray(r.hashtags)
        ? (r.hashtags as string[])
        : (r.hashtags && (r.hashtags as any).tags) || [],
      tagInput: "",
      product_id: r.product_id || "",
      blog_id: r.blog_id || "",
      thumbnail_url: r.thumbnail_url || "",
      video_url: r.video_url || "",
      is_display_home: !!r.is_display_home,
      thumbnail_file: undefined as any,
      video_file: undefined as any,
    }))
    setShowForm(true)
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-col gap-3">
        <h1 className="text-xl font-semibold">Reels</h1>
        <div className="flex items-center gap-2 overflow-x-auto flex-nowrap">
          <div className="shrink-0">
            <Select value={typeFilter || undefined} onValueChange={(v) => setTypeFilter(v)}>
              <Select.Trigger>
                <Select.Value placeholder="All types" />
              </Select.Trigger>
              <Select.Content className="z-[60]">
                <Select.Item value="video">Video</Select.Item>
                <Select.Item value="image">Image</Select.Item>
              </Select.Content>
            </Select>
          </div>
          <Input className="min-w-[180px]" placeholder="Product ID" value={productIdFilter} onChange={(e) => setProductIdFilter((e.target as HTMLInputElement).value)} />
          <Input className="min-w-[180px]" placeholder="Blog ID" value={blogIdFilter} onChange={(e) => setBlogIdFilter((e.target as HTMLInputElement).value)} />
          <Input className="min-w-[200px]" placeholder="Search name..." value={q} onChange={(e) => setQ((e.target as HTMLInputElement).value)} />
          <Button className="shrink-0 whitespace-nowrap" size="small" variant="secondary" onClick={() => { setPageIndex(0); refetch() }}>Filter</Button>
          <Button className="shrink-0 whitespace-nowrap" size="small" onClick={startCreate}>Add Reel</Button>
        </div>
      </div>

      <div className="overflow-x-auto border rounded">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Thumb</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Product</Table.HeaderCell>
              <Table.HeaderCell>Blog</Table.HeaderCell>
              <Table.HeaderCell>Created</Table.HeaderCell>
              <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading && (
              <Table.Row>
                <Table.Cell colSpan={7}>Loading...</Table.Cell>
              </Table.Row>
            )}
            {!isLoading && (data?.reels?.length || 0) === 0 && (
              <Table.Row>
                <Table.Cell colSpan={7}>
                  <div className="py-8 text-center">
                    <Text className="mb-2">No Reels Yet</Text>
                    <Button size="small" onClick={() => setShowForm(true)}>Create your first reel</Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
            {(data?.reels || []).map((r) => (
              <Table.Row key={r.id}>
                <Table.Cell>
                  {r.thumbnail_url ? (
                    <img src={r.thumbnail_url} alt={r.name} className="h-10 w-16 object-cover rounded border border-ui-border-base bg-ui-bg-base" />
                  ) : (
                    <div className="h-10 w-16 rounded border border-ui-border-base bg-ui-bg-subtle" />
                  )}
                </Table.Cell>
                <Table.Cell>{r.name}</Table.Cell>
                <Table.Cell>{r.type}</Table.Cell>
                <Table.Cell>{r.product_id || '-'}</Table.Cell>
                <Table.Cell>{r.blog_id || '-'}</Table.Cell>
                <Table.Cell>{new Date(r.created_at).toLocaleString()}</Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="small" variant="secondary" onClick={() => openEdit(r)}>Edit</Button>
                    {/* Hidden until DELETE route is added */}
                    {/* <Button size="small" variant="danger" onClick={() => handleDelete(r.id)} disabled={actingId === r.id}>{actingId === r.id ? "Deleting..." : "Delete"}</Button> */}
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
        title={editId ? "Edit Reel" : "Add Reel"}
        footer={(
          <>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" form="reel-form" disabled={saving}>{saving ? (editId ? "Updating..." : "Saving...") : (editId ? "Update" : "Save")}</Button>
          </>
        )}
      >
        <form id="reel-form" onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Type</label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as any }))}>
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content className="z-[60]">
                  <Select.Item value="video">Video</Select.Item>
                  <Select.Item value="image">Image</Select.Item>
                </Select.Content>
              </Select>
            </div>
            <div>
              <label className="block text-sm mb-1">Name</label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: (e.target as HTMLInputElement).value }))} required />
            </div>
            <div className="flex items-center gap-2">
              <input id="is_display_home" type="checkbox" checked={!!form.is_display_home} onChange={(e) => setForm((f) => ({ ...f, is_display_home: (e.target as HTMLInputElement).checked }))} />
              <label htmlFor="is_display_home" className="text-sm">Display on Home</label>
            </div>
            <div>
              <label className="block text-sm mb-1">Product ID</label>
              <Input value={form.product_id} onChange={(e) => setForm((f) => ({ ...f, product_id: (e.target as HTMLInputElement).value }))} placeholder="optional" />
            </div>
            <div>
              <label className="block text-sm mb-1">Blog ID</label>
              <Input value={form.blog_id} onChange={(e) => setForm((f) => ({ ...f, blog_id: (e.target as HTMLInputElement).value }))} placeholder="optional" />
            </div>
            <div>
              <label className="block text-sm mb-1">Thumbnail</label>
              <input type="file" accept="image/*" onChange={handleThumbChange} />
            </div>
            <div className="flex items-end">
              {form.thumbnail_file ? (
                <img src={URL.createObjectURL(form.thumbnail_file)} alt="preview" className="h-16 w-24 object-cover rounded border border-ui-border-base bg-ui-bg-base" />
              ) : form.thumbnail_url ? (
                <img src={form.thumbnail_url} alt="preview" className="h-16 w-24 object-cover rounded border border-ui-border-base bg-ui-bg-base" />
              ) : (
                <div className="h-16 w-24 rounded border border-ui-border-base bg-ui-bg-subtle" />)
              }
            </div>
            {form.type === "video" && (
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Video</label>
                <input type="file" accept="video/*" onChange={handleVideoChange} />
                <Text size="small" className="text-ui-fg-subtle mt-1 block">Upload a product video</Text>
              </div>
            )}
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
          </div>
        </form>
      </SimpleModal>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Reels",
})

export default ReelsPage
