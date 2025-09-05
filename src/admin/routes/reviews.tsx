import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { defineRouteConfig, sdk } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight } from "@medusajs/icons"
import { Button, Input } from "@medusajs/ui"

export type Review = {
  id: string
  title?: string | null
  content: string
  rating: number
  first_name: string
  last_name: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}

const limit = 15

const ReviewsPage = () => {
  const [pageIndex, setPageIndex] = useState(0)
  const [status, setStatus] = useState<string>("")
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

  const handleCreate = async (e: React.FormEvent) => {
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

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-col gap-3">
        <h1 className="text-xl font-semibold">Reviews</h1>
        <div className="flex items-center gap-2 whitespace-nowrap overflow-x-auto">
          <select
            className="border rounded px-2 py-1"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <Button size="small" variant="secondary" onClick={() => { setPageIndex(0); refetch() }}>Filter</Button>
          <Button size="small" onClick={() => setShowCreate((s) => !s)}>
            {showCreate ? "Close" : "Create Review"}
          </Button>
        </div>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3 border rounded p-4">
          <div>
            <label className="block text-sm mb-1">Product ID</label>
            <Input
              value={form.product_id}
              onChange={(e) => setForm((f) => ({ ...f, product_id: e.target.value }))}
              placeholder="prod_..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">First name</label>
              <Input
                value={form.first_name}
                onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Last name</label>
              <Input
                value={form.last_name}
                onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                placeholder="Doe"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Rating (1-5)</label>
            <Input
              type="number"
              min={1}
              max={5}
              value={form.rating}
              onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              className="border rounded px-2 py-1 w-full"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as any }))}
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
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Great product!"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Content</label>
            <textarea
              className="w-full border rounded p-2 h-24"
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="Write the review content..."
            />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" disabled={creating}>{creating ? "Creating..." : "Create"}</Button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Created</th>
              <th className="px-3 py-2 text-left">Product</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Rating</th>
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="px-3 py-3" colSpan={6}>Loading...</td>
              </tr>
            )}
            {!isLoading && (data?.reviews?.length || 0) === 0 && (
              <tr>
                <td className="px-3 py-3" colSpan={6}>No reviews found.</td>
              </tr>
            )}
            {data?.reviews?.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">{new Date(r.created_at).toLocaleString()}</td>
                <td className="px-3 py-2">{r.id.slice(0, 8)}</td>
                <td className="px-3 py-2">{r.first_name} {r.last_name}</td>
                <td className="px-3 py-2">{r.rating}</td>
                <td className="px-3 py-2">{r.title || "-"}</td>
                <td className="px-3 py-2 capitalize">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
