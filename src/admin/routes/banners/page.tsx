import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Button, Input } from "@medusajs/ui"
import { DocumentText } from "@medusajs/icons"
import { sdk } from "../../lib/sdk"

export type Banner = {
  id: string
  name: string
  desktop_image_url?: string | null
  mobile_image_url?: string | null
  link_url?: string | null
  position: number
  created_at: string
}

const limit = 50

const BannersPage = () => {
  const queryClient = useQueryClient()
  const [pageIndex, setPageIndex] = useState(0)
  const [form, setForm] = useState({
    name: "",
    desktop_image_url: "",
    mobile_image_url: "",
    link_url: "",
    position: 0,
  })
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    desktop_image_url: "",
    mobile_image_url: "",
    link_url: "",
    position: 0,
  })

  const offset = useMemo(() => pageIndex * limit, [pageIndex])

  const { data, isLoading } = useQuery<{
    banners: Banner[]
    count: number
    limit: number
    offset: number
  }>({
    queryKey: ["admin-banners", offset, limit],
    queryFn: () =>
      sdk.client.fetch("/admin/banners", {
        query: {
          offset,
          limit,
          order: "position",
        },
      }),
  })

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload: any = {
        name: form.name.trim(),
        desktop_image_url: form.desktop_image_url || null,
        mobile_image_url: form.mobile_image_url || null,
        link_url: form.link_url || null,
        position: Number(form.position) || 0,
      }
      return sdk.client.fetch("/admin/banners", {
        method: "POST",
        body: payload,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] })
      setForm({ name: "", desktop_image_url: "", mobile_image_url: "", link_url: "", position: 0 })
    },
  })

  const patchMutation = useMutation({
    mutationFn: async (vars: { id: string }) => {
      const { id } = vars
      const payload: any = {
        name: editForm.name.trim() || undefined,
        desktop_image_url: editForm.desktop_image_url || null,
        mobile_image_url: editForm.mobile_image_url || null,
        link_url: editForm.link_url || null,
        position: Number(editForm.position),
      }
      return sdk.client.fetch(`/admin/banners/${id}`, {
        method: "PATCH",
        body: payload,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] })
      setEditId(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (vars: { id: string }) => {
      const { id } = vars
      return sdk.client.fetch(`/admin/banners/${id}`, {
        method: "DELETE",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] })
    },
  })

  const total = typeof data?.count === "number" ? data!.count : 0
  const pageCount = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-col gap-3">
        <h1 className="text-xl font-semibold">Banners</h1>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end border rounded p-3">
          <div className="md:col-span-2">
            <label className="text-xs text-gray-600">Banner name</label>
            <Input
              placeholder="e.g. Diwali Sale"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-600">Desktop image URL</label>
            <Input
              placeholder="https://..."
              value={form.desktop_image_url}
              onChange={(e) => setForm((f) => ({ ...f, desktop_image_url: e.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-600">Mobile image URL</label>
            <Input
              placeholder="https://..."
              value={form.mobile_image_url}
              onChange={(e) => setForm((f) => ({ ...f, mobile_image_url: e.target.value }))}
            />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs text-gray-600">Link URL</label>
            <Input
              placeholder="https://... or /products/xyz"
              value={form.link_url}
              onChange={(e) => setForm((f) => ({ ...f, link_url: e.target.value }))}
            />
          </div>
          <div className="md:col-span-1">
            <label className="text-xs text-gray-600">Position</label>
            <Input
              type="number"
              placeholder="0"
              value={String(form.position)}
              onChange={(e) => setForm((f) => ({ ...f, position: Number(e.target.value || 0) }))}
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button
              size="small"
              onClick={() => createMutation.mutate()}
              disabled={!form.name.trim() || createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create banner"}
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Position</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Desktop</th>
              <th className="px-3 py-2 text-left">Mobile</th>
              <th className="px-3 py-2 text-left">Link</th>
              <th className="px-3 py-2 text-left">Created</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="px-3 py-3" colSpan={6}>Loading...</td>
              </tr>
            )}
            {!isLoading && (data?.banners?.length || 0) === 0 && (
              <tr>
                <td className="px-3 py-3" colSpan={6}>No banners found.</td>
              </tr>
            )}
            {(data?.banners ?? [])
              .filter((b): b is Banner => !!b)
              .map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="px-3 py-2">{typeof b.position === 'number' ? b.position : '-'}</td>
                  <td className="px-3 py-2">{b?.name ?? '-'}</td>
                  <td className="px-3 py-2 truncate max-w-[240px]"><a href={b?.desktop_image_url || '#'} target="_blank" className="text-blue-600 underline" rel="noreferrer">{b?.desktop_image_url || '-'}</a></td>
                  <td className="px-3 py-2 truncate max-w-[240px]"><a href={b?.mobile_image_url || '#'} target="_blank" className="text-blue-600 underline" rel="noreferrer">{b?.mobile_image_url || '-'}</a></td>
                  <td className="px-3 py-2 truncate max-w-[240px]"><a href={b?.link_url || '#'} target="_blank" className="text-blue-600 underline" rel="noreferrer">{b?.link_url || '-'}</a></td>
                  <td className="px-3 py-2">{b?.created_at ? new Date(b.created_at).toLocaleString() : '-'}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => {
                          setEditId(b.id)
                          setEditForm({
                            name: b.name || "",
                            desktop_image_url: b.desktop_image_url || "",
                            mobile_image_url: b.mobile_image_url || "",
                            link_url: b.link_url || "",
                            position: typeof b.position === 'number' ? b.position : 0,
                          })
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="danger"
                        onClick={() => deleteMutation.mutate({ id: b.id })}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {editId && (
        <div className="mt-6 border rounded p-3 grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
          <div className="md:col-span-2">
            <label className="text-xs text-gray-600">Banner name</label>
            <Input
              placeholder="e.g. Diwali Sale"
              value={editForm.name}
              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-600">Desktop image URL</label>
            <Input
              placeholder="https://..."
              value={editForm.desktop_image_url}
              onChange={(e) => setEditForm((f) => ({ ...f, desktop_image_url: e.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-600">Mobile image URL</label>
            <Input
              placeholder="https://..."
              value={editForm.mobile_image_url}
              onChange={(e) => setEditForm((f) => ({ ...f, mobile_image_url: e.target.value }))}
            />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs text-gray-600">Link URL</label>
            <Input
              placeholder="https://... or /products/xyz"
              value={editForm.link_url}
              onChange={(e) => setEditForm((f) => ({ ...f, link_url: e.target.value }))}
            />
          </div>
          <div className="md:col-span-1">
            <label className="text-xs text-gray-600">Position</label>
            <Input
              type="number"
              placeholder="0"
              value={String(editForm.position)}
              onChange={(e) => setEditForm((f) => ({ ...f, position: Number(e.target.value || 0) }))}
            />
          </div>
          <div className="md:col-span-2 flex gap-2 justify-end">
            <Button size="small" variant="secondary" onClick={() => setEditId(null)}>Cancel</Button>
            <Button
              size="small"
              onClick={() => editId && patchMutation.mutate({ id: editId })}
              disabled={patchMutation.isPending}
            >
              {patchMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      )}

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
  label: "Banners",
  icon: DocumentText,
})

export default BannersPage
