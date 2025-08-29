import { useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Folder } from "@medusajs/icons"
import { Button, Input, Table, Text } from "@medusajs/ui"
import { sdk } from "../../lib/sdk"

export type BlogCategory = {
  id: string
  name: string
  created_at: string
}

const limit = 50

// Medusa-themed lightweight modal (using design tokens)
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
        <div className="w-full max-w-xl rounded-md border border-ui-border bg-ui-bg-base text-ui-fg-base shadow-lg">
          <div className="flex items-center justify-between border-b border-ui-border px-6 py-4">
            <h3 className="text-base font-semibold">{title}</h3>
            <button
              className="text-ui-fg-subtle hover:text-ui-fg-base"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              type="button"
            >
              ×
            </button>
          </div>
          <div className="max-h-[70vh] overflow-auto p-6">{children}</div>
          <div className="flex items-center justify-end gap-2 border-t border-ui-border px-6 py-4">
            {footer}
          </div>
        </div>
      </div>
    </div>
  )
}

const BlogCategoriesPage = () => {
  const [pageIndex, setPageIndex] = useState(0)
  const [q, setQ] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<BlogCategory | null>(null)
  const [formName, setFormName] = useState("")
  const [saving, setSaving] = useState(false)
  const [actingId, setActingId] = useState<string | null>(null)

  const offset = useMemo(() => pageIndex * limit, [pageIndex])

  const { data, isLoading, refetch } = useQuery<{ categories: BlogCategory[]; count: number; limit: number; offset: number }>({
    queryKey: ["admin-blog-categories", offset, limit, q],
    queryFn: () =>
      sdk.client.fetch("/admin/blog-categories", {
        query: {
          offset,
          limit,
          ...(q ? { q } : {}),
        },
      }),
  })

  const total = data?.count || 0
  const pageCount = Math.max(1, Math.ceil(total / limit))

  useEffect(() => {
    if (!showForm) {
      setEditing(null)
      setFormName("")
    }
  }, [showForm])

  const openCreate = () => {
    setEditing(null)
    setFormName("")
    setShowForm(true)
  }

  const openEdit = (c: BlogCategory) => {
    setEditing(c)
    setFormName(c.name)
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return
    try {
      setSaving(true)
      if (editing) {
        await sdk.client.fetch(`/admin/blog-categories/${editing.id}`, { method: "PATCH", body: { name: formName.trim() } })
      } else {
        await sdk.client.fetch(`/admin/blog-categories`, { method: "POST", body: { name: formName.trim() } })
      }
      setShowForm(false)
      await refetch()
    } catch (e) {
      console.error(e)
      alert("Failed to save category")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return
    try {
      setActingId(id)
      await sdk.client.fetch(`/admin/blog-categories/${id}`, { method: "DELETE" })
      await refetch()
    } catch (e) {
      console.error(e)
      alert("Failed to delete category")
    } finally {
      setActingId(null)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Blog Categories</h1>
        <div className="flex items-center gap-2">
          <Input placeholder="Search by name" value={q} onChange={(e) => setQ((e.target as HTMLInputElement).value)} />
          <Button size="small" variant="secondary" onClick={() => { setPageIndex(0); refetch() }}>Filter</Button>
          <Button size="small" variant="primary" onClick={openCreate}>Add Category</Button>
        </div>
      </div>

      <div className="overflow-x-auto border rounded">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Created</Table.HeaderCell>
              <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading && (
              <Table.Row>
                <Table.Cell>Loading...</Table.Cell>
                <Table.Cell />
                <Table.Cell />
              </Table.Row>
            )}
            {!isLoading && (data?.categories?.length || 0) === 0 && (
              <Table.Row>
                <Table.Cell>
                  <div className="py-8">
                    <Text className="mb-2">No Categories Yet</Text>
                    <Button size="small" variant="primary" onClick={openCreate}>Create your first category</Button>
                  </div>
                </Table.Cell>
                <Table.Cell />
                <Table.Cell />
              </Table.Row>
            )}
            {(data?.categories || []).map((c, idx) => {
              if (!c) return null
              return (
                <Table.Row key={c.id ?? idx}>
                  <Table.Cell>{c.name ?? "-"}</Table.Cell>
                  <Table.Cell>{c.created_at ? new Date(c.created_at).toLocaleString() : "-"}</Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="small" variant="secondary" onClick={() => openEdit(c)}>Edit</Button>
                      <Button size="small" variant="danger" onClick={() => handleDelete(c.id)} disabled={actingId === c.id}>
                        {actingId === c.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )
            })}
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
        title={editing ? "Edit Category" : "Add Category"}
        footer={(
          <>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" variant="primary" form="blog-cat-form" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </>
        )}
      >
        <form id="blog-cat-form" onSubmit={handleSave}>
          <div className="space-y-2">
            <label className="block text-sm">Category Name</label>
            <Input value={formName} onChange={(e) => setFormName((e.target as HTMLInputElement).value)} placeholder="e.g. Fashion" required />
          </div>
        </form>
      </SimpleModal>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Blog Categories",
  icon: Folder,
})

export default BlogCategoriesPage
