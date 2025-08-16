import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight } from "@medusajs/icons"
import { Badge, Button, Select, Table, Input } from "@medusajs/ui"
import { sdk } from "../../lib/sdk"

export type Review = {
  id: string
  title?: string | null
  content: string
  rating: number
  first_name: string
  last_name: string
  status: "pending" | "approved" | "rejected"
  created_at: string
  product_id: string
}

type Product = {
  id: string
  title?: string | null
}

const limit = 15

const ReviewsPage = () => {
  const [pageIndex, setPageIndex] = useState(0)
  const [status, setStatus] = useState<string>("")
  const [actingId, setActingId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({
    product_id: "",
    first_name: "",
    last_name: "",
    rating: 5,
    title: "",
    content: "",
    status: "approved" as "pending" | "approved" | "rejected",
  })

  const offset = useMemo(() => pageIndex * limit, [pageIndex])

  const { data, isLoading, refetch } = useQuery<{
    reviews: Review[]
    count: number
    limit: number
    offset: number
  }>({
    queryKey: ["admin-reviews", offset, limit, status],
    queryFn: () =>
      sdk.client.fetch("/admin/reviews", {
        query: {
          offset,
          limit,
          order: "-created_at",
          ...(status ? { status } : {}),
        },
      }),
  })

  const total = data?.count || 0
  const pageCount = Math.ceil(total / limit)

  // Edit state (declare before products query to avoid lint errors)
  const [editing, setEditing] = useState<Review | null>(null)
  const [updating, setUpdating] = useState(false)
  const [editForm, setEditForm] = useState({
    product_id: "",
    first_name: "",
    last_name: "",
    rating: 5,
    title: "" as string | null,
    content: "",
    status: "approved" as "pending" | "approved" | "rejected",
  })

  // Fetch products for the dropdown when the create form is visible
  const { data: productsData, isLoading: loadingProducts } = useQuery<{ products: Product[] }>({
    queryKey: ["admin-products", showCreate || !!editing],
    queryFn: async () => {
      if (!showCreate && !editing) return { products: [] as Product[] }
      const res = await sdk.client.fetch("/admin/products", {
        query: { limit: 50, order: "-created_at" },
      })
      return res as { products: Product[] }
    },
    enabled: showCreate || !!editing,
  })


  const openEdit = (r: Review) => {
    setShowCreate(false)
    setEditing(r)
    setEditForm({
      product_id: r.product_id,
      first_name: r.first_name,
      last_name: r.last_name,
      rating: r.rating,
      title: r.title ?? "",
      content: r.content,
      status: r.status,
    })
  }

  const handleUpdate = async (e: any) => {
    e?.preventDefault?.()
    if (!editing) return
    if (editForm.rating < 1 || editForm.rating > 5) {
      alert("Rating must be between 1 and 5")
      return
    }
    try {
      setUpdating(true)
      await sdk.client.fetch(`/admin/reviews/${editing.id}`, {
        method: "PATCH",
        body: {
          product_id: editForm.product_id,
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          rating: editForm.rating,
          title: editForm.title || null,
          content: editForm.content,
          status: editForm.status,
        },
      })
      setEditing(null)
      await refetch()
    } catch (err) {
      console.error(err)
      alert("Failed to update review")
    } finally {
      setUpdating(false)
    }
  }

  const handleCreate = async (e: any) => {
    e.preventDefault()
    if (!form.product_id || !form.first_name || !form.last_name || !form.content) {
      alert("Please fill product, first name, last name and content")
      return
    }
    if (form.rating < 1 || form.rating > 5) {
      alert("Rating must be between 1 and 5")
      return
    }
    try {
      setCreating(true)
      await sdk.client.fetch("/admin/reviews/fake", {
        method: "POST",
        body: {
          product_id: form.product_id,
          first_name: form.first_name,
          last_name: form.last_name,
          rating: form.rating,
          title: form.title || undefined,
          content: form.content,
          status: form.status,
        },
      })
      setShowCreate(false)
      setForm({
        product_id: "",
        first_name: "",
        last_name: "",
        rating: 5,
        title: "",
        content: "",
        status: "approved",
      })
      setPageIndex(0)
      await refetch()
    } catch (err) {
      console.error(err)
      alert("Failed to create review")
    } finally {
      setCreating(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      setActingId(id)
      await sdk.client.fetch(`/admin/reviews/${id}/approve`, { method: "POST" })
      await refetch()
    } finally {
      setActingId(null)
    }
  }

  const handleReject = async (id: string) => {
    try {
      setActingId(id)
      await sdk.client.fetch(`/admin/reviews/${id}/reject`, { method: "POST" })
      await refetch()
    } finally {
      setActingId(null)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-col gap-3">
        <h1 className="text-xl font-semibold">Reviews</h1>
        <div className="flex items-center gap-2 whitespace-nowrap overflow-x-auto">
          <Select value={status || undefined} onValueChange={(v) => setStatus(v)}>
            <Select.Trigger>
              <Select.Value placeholder="All statuses" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="pending">Pending</Select.Item>
              <Select.Item value="approved">Approved</Select.Item>
              <Select.Item value="rejected">Rejected</Select.Item>
            </Select.Content>
          </Select>
          <Button size="small" variant="secondary" onClick={() => { setPageIndex(0); refetch() }}>Filter</Button>
          {!editing && (
            <Button size="small" onClick={() => setShowCreate((s) => !s)}>
              {showCreate ? "Close" : "Create Review"}
            </Button>
          )}
        </div>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="mb-4 border rounded p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm mb-1">Product</label>
              <Select
                value={form.product_id || undefined}
                onValueChange={(v) => setForm((f) => ({ ...f, product_id: v }))}
              >
                <Select.Trigger>
                  <Select.Value placeholder={loadingProducts ? "Loading products..." : "Select a product"} />
                </Select.Trigger>
                <Select.Content>
                  {(productsData?.products || []).map((p: Product) => (
                    <Select.Item key={p.id} value={p.id}>
                      {p.title || p.id}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
            <div>
              <label className="block text-sm mb-1">First name</label>
              <Input
                value={form.first_name}
                onChange={(e) => setForm((f) => ({ ...f, first_name: (e.target as HTMLInputElement).value }))}
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Last name</label>
              <Input
                value={form.last_name}
                onChange={(e) => setForm((f) => ({ ...f, last_name: (e.target as HTMLInputElement).value }))}
                placeholder="Doe"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Rating (1-5)</label>
              <Input
                type="number"
                min={1}
                max={5}
                value={form.rating}
                onChange={(e) => setForm((f) => ({ ...f, rating: Number((e.target as HTMLInputElement).value) }))}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Status</label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: (e.target as HTMLSelectElement).value as any }))}
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Title</label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: (e.target as HTMLInputElement).value }))}
                placeholder="Great product!"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm mb-1">Content</label>
              <textarea
                className="w-full border rounded p-2 h-24"
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: (e.target as HTMLTextAreaElement).value }))}
                placeholder="Write the review content..."
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" disabled={creating}>{creating ? "Creating..." : "Create"}</Button>
          </div>
        </form>
      )}

      {/* Inline Edit form (like create) */}
      {editing && (
        <form onSubmit={handleUpdate} className="mb-4 border rounded p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm mb-1">Product</label>
              <Select
                value={editForm.product_id || undefined}
                onValueChange={(v) => setEditForm((f) => ({ ...f, product_id: v }))}
              >
                <Select.Trigger>
                  <Select.Value placeholder={loadingProducts ? "Loading products..." : "Select a product"} />
                </Select.Trigger>
                <Select.Content>
                  {(productsData?.products || []).map((p: Product) => (
                    <Select.Item key={p.id} value={p.id}>
                      {p.title || p.id}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
            <div>
              <label className="block text-sm mb-1">First name</label>
              <Input
                value={editForm.first_name}
                onChange={(e) => setEditForm((f) => ({ ...f, first_name: (e.target as HTMLInputElement).value }))}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Last name</label>
              <Input
                value={editForm.last_name}
                onChange={(e) => setEditForm((f) => ({ ...f, last_name: (e.target as HTMLInputElement).value }))}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Rating (1-5)</label>
              <Input
                type="number"
                min={1}
                max={5}
                value={editForm.rating}
                onChange={(e) => setEditForm((f) => ({ ...f, rating: Number((e.target as HTMLInputElement).value) }))}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Status</label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={editForm.status}
                onChange={(e) => setEditForm((f) => ({ ...f, status: (e.target as HTMLSelectElement).value as any }))}
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm mb-1">Title</label>
              <Input
                value={editForm.title ?? ""}
                onChange={(e) => setEditForm((f) => ({ ...f, title: (e.target as HTMLInputElement).value }))}
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm mb-1">Content</label>
              <textarea
                className="w-full border rounded p-2 h-24"
                value={editForm.content}
                onChange={(e) => setEditForm((f) => ({ ...f, content: (e.target as HTMLTextAreaElement).value }))}
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
            <Button type="submit" disabled={updating}>{updating ? "Saving..." : "Update"}</Button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto border rounded">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Created</Table.HeaderCell>
              <Table.HeaderCell>Product</Table.HeaderCell>
              <Table.HeaderCell>Customer</Table.HeaderCell>
              <Table.HeaderCell>Rating</Table.HeaderCell>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading && (
              <Table.Row>
                <Table.Cell>Loading...</Table.Cell>
                <Table.Cell />
                <Table.Cell />
                <Table.Cell />
                <Table.Cell />
                <Table.Cell />
                <Table.Cell />
              </Table.Row>
            )}
            {!isLoading && (data?.reviews?.length || 0) === 0 && (
              <Table.Row>
                <Table.Cell>No reviews found.</Table.Cell>
                <Table.Cell />
                <Table.Cell />
                <Table.Cell />
                <Table.Cell />
                <Table.Cell />
                <Table.Cell />
              </Table.Row>
            )}
            {data?.reviews?.map((r) => (
              <Table.Row key={r.id}>
                <Table.Cell>{new Date(r.created_at).toLocaleString()}</Table.Cell>
                <Table.Cell>{r.id.slice(0, 8)}</Table.Cell>
                <Table.Cell>{r.first_name} {r.last_name}</Table.Cell>
                <Table.Cell>{r.rating}</Table.Cell>
                <Table.Cell>{r.title || "-"}</Table.Cell>
                <Table.Cell>
                  <Badge
                    color={
                      r.status === "approved"
                        ? "green"
                        : r.status === "rejected"
                        ? "red"
                        : "orange"
                    }
                  >
                    {r.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => openEdit(r)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="secondary"
                      disabled={actingId === r.id || r.status === "approved"}
                      onClick={() => handleApprove(r.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="small"
                      variant="danger"
                      disabled={actingId === r.id || r.status === "rejected"}
                      onClick={() => handleReject(r.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Page {pageIndex + 1} of {pageCount || 1} • Total {total}
        </div>
        <div className="flex gap-2">
          <Button size="small" disabled={pageIndex === 0} onClick={() => setPageIndex((p) => Math.max(0, p - 1))}>
            Previous
          </Button>
          <Button size="small" disabled={pageIndex + 1 >= pageCount} onClick={() => setPageIndex((p) => p + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Reviews",
  icon: ChatBubbleLeftRight,
})

export default ReviewsPage
