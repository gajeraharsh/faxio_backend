import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Button } from "@medusajs/ui"
import { ChatBubbleLeftRight } from "@medusajs/icons"
import { sdk } from "../../lib/sdk"

export type Contact = {
  id: string
  name: string
  email: string
  phone?: string | null
  subject: string
  message: string
  status: "new" | "in_progress" | "resolved"
  created_at: string
}

const limit = 15

const ContactsPage = () => {
  const [pageIndex, setPageIndex] = useState(0)
  const [status, setStatus] = useState<string>("")

  const offset = useMemo(() => pageIndex * limit, [pageIndex])

  const { data, isLoading, refetch } = useQuery<{
    contacts: Contact[]
    count: number
    limit: number
    offset: number
  }>({
    queryKey: ["admin-contacts", offset, limit, status],
    queryFn: () =>
      sdk.client.fetch("/admin/contacts", {
        query: {
          offset,
          limit,
          order: "-created_at",
          ...(status ? { status } : {}),
        },
      }),
  })

  // Defensive parsing: filter out null contacts and derive total when backend returns incorrect count
  const rows = Array.isArray(data?.contacts) ? ((data!.contacts as (Contact | null)[]).filter(Boolean) as Contact[]) : []
  const total = typeof data?.count === "number" && data!.count > 0 ? data!.count : rows.length
  const pageCount = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-col gap-3">
        <h1 className="text-xl font-semibold">Contacts</h1>
        <div className="flex items-center gap-2 whitespace-nowrap overflow-x-auto">
          <select
            className="border rounded px-2 py-1"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <Button size="small" variant="secondary" onClick={() => { setPageIndex(0); refetch() }}>Filter</Button>
        </div>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Created</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Phone</th>
              <th className="px-3 py-2 text-left">Subject</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="px-3 py-3" colSpan={6}>Loading...</td>
              </tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr>
                <td className="px-3 py-3" colSpan={6}>No contacts found.</td>
              </tr>
            )}
            {rows.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-3 py-2">{c?.created_at ? new Date(c.created_at).toLocaleString() : '-'}</td>
                <td className="px-3 py-2">{c?.name ?? '-'}</td>
                <td className="px-3 py-2">{c?.email ?? '-'}</td>
                <td className="px-3 py-2">{c?.phone || '-'}</td>
                <td className="px-3 py-2">{c?.subject ?? '-'}</td>
                <td className="px-3 py-2 capitalize">{(c?.status || 'new').replace('_', ' ')}</td>
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
  label: "Contacts",
  icon: ChatBubbleLeftRight,
})

export default ContactsPage
