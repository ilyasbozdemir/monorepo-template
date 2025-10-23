"use client"

import { useState } from "react"
import {
  Plus,
  Trash2,
  Edit,
  Filter,
  Download,
  MoreVertical,
  TableIcon,
  Code,
  ChevronLeft,
  ChevronRight,
  Database,
  GitBranch,
  Shield,
  List,
  Lock,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMongoStore } from "@/store/mongo-store"
import DocumentEditor from "./document-editor"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CollectionViewProps {
  dbName: string
  collectionName: string
}

type ViewType = "json" | "table"
type TabType = "documents" | "aggregations" | "schema" | "indexes" | "validation" | "rules"

export default function CollectionView({ dbName, collectionName }: CollectionViewProps) {
  const { databases, deleteDocument } = useMongoStore()
  const [editingDoc, setEditingDoc] = useState<any | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [viewType, setViewType] = useState<ViewType>("json")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [activeTab, setActiveTab] = useState<TabType>("documents")

  const allDocuments = databases[dbName]?.collections[collectionName] || []

  const totalCount = allDocuments.length
  const totalPages = Math.ceil(totalCount / pageSize)
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const documents = allDocuments.slice(startIndex, endIndex)
  const hasPrevious = page > 1
  const hasNext = page < totalPages

  const handleDelete = (docId: string) => {
    deleteDocument(dbName, collectionName, docId)
  }

  const getAllKeys = () => {
    const keys = new Set<string>()
    documents.forEach((doc) => {
      Object.keys(doc).forEach((key) => keys.add(key))
    })
    return Array.from(keys)
  }

  const tableHeaders = getAllKeys()

  const analyzeSchema = () => {
    const schema: Record<string, { type: string; count: number }> = {}
    allDocuments.forEach((doc) => {
      Object.entries(doc).forEach(([key, value]) => {
        if (!schema[key]) {
          schema[key] = { type: typeof value, count: 0 }
        }
        schema[key].count++
      })
    })
    return schema
  }

  const schemaData = analyzeSchema()

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)} className="flex-1 flex flex-col">
        <div className="border-b border-border bg-card">
          <div className="flex items-center">
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <TabsList className="w-full justify-start rounded-none bg-transparent h-auto p-0 border-b-0 inline-flex">
                <TabsTrigger
                  value="documents"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap"
                >
                  <List className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Documents</span>
                  <span className="sm:hidden">Docs</span>
                </TabsTrigger>
                <TabsTrigger
                  value="aggregations"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap"
                >
                  <GitBranch className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Aggregations</span>
                  <span className="sm:hidden">Agg</span>
                </TabsTrigger>
                <TabsTrigger
                  value="schema"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap"
                >
                  <Database className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Schema
                </TabsTrigger>
                <TabsTrigger
                  value="indexes"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap"
                >
                  <List className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Indexes
                </TabsTrigger>
                <TabsTrigger
                  value="validation"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap"
                >
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Validation</span>
                  <span className="sm:hidden">Valid</span>
                </TabsTrigger>
                <TabsTrigger
                  value="rules"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap"
                >
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Rules
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overflow menu for mobile */}
            <div className="border-l border-border shrink-0 lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-10 px-3 rounded-none">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setActiveTab("documents")}>
                    <List className="w-4 h-4 mr-2" />
                    Documents
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("aggregations")}>
                    <GitBranch className="w-4 h-4 mr-2" />
                    Aggregations
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("schema")}>
                    <Database className="w-4 h-4 mr-2" />
                    Schema
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("indexes")}>
                    <List className="w-4 h-4 mr-2" />
                    Indexes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("validation")}>
                    <Shield className="w-4 h-4 mr-2" />
                    Validation
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("rules")}>
                    <Lock className="w-4 h-4 mr-2" />
                    Rules
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Documents Tab */}
        <TabsContent value="documents" className="flex-1 flex flex-col overflow-hidden m-0">
          {/* Toolbar */}
          <div className="border-b border-border bg-card px-2 sm:px-4 py-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-x-auto">
              <div className="flex items-center border border-border rounded-md shrink-0">
                <Button
                  variant={viewType === "json" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 px-2 sm:px-3 rounded-r-none text-xs"
                  onClick={() => setViewType("json")}
                >
                  <Code className="w-3 h-3 sm:mr-1" />
                  <span className="hidden sm:inline">JSON</span>
                </Button>
                <Button
                  variant={viewType === "table" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 px-2 sm:px-3 rounded-l-none text-xs"
                  onClick={() => setViewType("table")}
                >
                  <TableIcon className="w-3 h-3 sm:mr-1" />
                  <span className="hidden sm:inline">Table</span>
                </Button>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent hidden sm:flex">
                <Filter className="w-3 h-3 mr-1" />
                Filter
              </Button>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <span className="text-xs text-muted-foreground">
                {totalCount} {totalCount === 1 ? "document" : "documents"}
              </span>
              <div className="flex gap-1 sm:gap-2">
                <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent hidden sm:flex">
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="h-7 text-xs bg-primary hover:bg-primary/90"
                  onClick={() => setIsCreating(true)}
                >
                  <Plus className="w-3 h-3 sm:mr-1" />
                  <span className="hidden sm:inline"></span>
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hidden sm:flex">
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Documents List */}
          <div className="flex-1 overflow-y-auto bg-background">
            {allDocuments.length === 0 ? (
              <div className="flex items-center justify-center h-full p-4">
                <div className="text-center text-muted-foreground">
                  <p className="text-sm mb-3">No documents in this collection</p>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setIsCreating(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Document
                  </Button>
                </div>
              </div>
            ) : viewType === "json" ? (
              <div className="p-2 sm:p-4 space-y-2">
                {documents.map((doc, index) => (
                  <div
                    key={doc._id}
                    className="bg-card border border-border rounded hover:border-primary/30 transition-colors group"
                  >
                    <div className="flex items-center justify-between px-2 sm:px-3 py-2 border-b border-border bg-muted/30 gap-2">
                      <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                        <span className="text-xs font-mono text-muted-foreground w-6 sm:w-8 shrink-0">
                          {startIndex + index + 1}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground hidden sm:inline shrink-0">_id:</span>
                        <span className="text-xs font-mono truncate">{doc._id}</span>
                      </div>
                      <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingDoc(doc)}
                          className="h-6 px-1 sm:px-2 text-xs"
                        >
                          <Edit className="w-3 h-3 sm:mr-1" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(doc._id)}
                          className="h-6 px-1 sm:px-2 text-xs text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3 sm:mr-1" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </div>
                    <div className="p-2 sm:p-3">
                      <pre className="text-xs font-mono overflow-x-auto">{JSON.stringify(doc, null, 2)}</pre>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-2 sm:p-4 overflow-x-auto">
                <div className="border border-border rounded-md overflow-hidden min-w-max">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-12 text-xs">#</TableHead>
                        {tableHeaders.map((header) => (
                          <TableHead key={header} className="text-xs font-semibold">
                            {header}
                          </TableHead>
                        ))}
                        <TableHead className="w-24 text-xs">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((doc, index) => (
                        <TableRow key={doc._id} className="hover:bg-muted/30">
                          <TableCell className="text-xs text-muted-foreground">{startIndex + index + 1}</TableCell>
                          {tableHeaders.map((header) => (
                            <TableCell key={header} className="text-xs font-mono max-w-xs truncate">
                              {typeof doc[header] === "object"
                                ? JSON.stringify(doc[header])
                                : String(doc[header] ?? "-")}
                            </TableCell>
                          ))}
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingDoc(doc)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(doc._id)}
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>

          {allDocuments.length > 0 && (
            <div className="border-t border-border bg-card px-2 sm:px-4 py-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs bg-transparent"
                  disabled={!hasPrevious}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="w-3 h-3 mr-1" />
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs bg-transparent"
                  disabled={!hasNext}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-end">
                <Label className="text-xs text-muted-foreground">Page size:</Label>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(val) => {
                    setPageSize(Number(val))
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-16 h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 20, 50, 100].map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="aggregations" className="flex-1 overflow-y-auto m-0 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Aggregation Pipeline</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Build and run aggregation pipelines to transform and analyze your data
              </p>
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-md p-4 font-mono text-sm">
                  <div className="text-muted-foreground mb-2">// Example pipeline</div>
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(
                      [
                        { $match: { status: "active" } },
                        { $group: { _id: "$category", total: { $sum: "$amount" } } },
                        { $sort: { total: -1 } },
                      ],
                      null,
                      2,
                    )}
                  </pre>
                </div>
                <Button className="w-full sm:w-auto">
                  <GitBranch className="w-4 h-4 mr-2" />
                  Run Pipeline
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schema" className="flex-1 overflow-y-auto m-0 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Schema Analysis</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Analyzed {allDocuments.length} documents in this collection
              </p>
              <div className="space-y-2">
                {Object.entries(schemaData).map(([field, info]) => (
                  <div key={field} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-3">
                      <Database className="w-4 h-4 text-primary" />
                      <div>
                        <div className="font-mono text-sm font-medium">{field}</div>
                        <div className="text-xs text-muted-foreground">
                          Type: {info.type} • Appears in {info.count}/{allDocuments.length} documents
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {((info.count / allDocuments.length) * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="indexes" className="flex-1 overflow-y-auto m-0 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Indexes</h3>
                  <p className="text-sm text-muted-foreground">Manage indexes for better query performance</p>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Index
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                  <div className="flex items-center gap-3">
                    <List className="w-4 h-4 text-primary" />
                    <div>
                      <div className="font-mono text-sm font-medium">_id_</div>
                      <div className="text-xs text-muted-foreground">Default index on _id field</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">Unique</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="validation" className="flex-1 overflow-y-auto m-0 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Validation Rules</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Define JSON Schema validation rules for documents in this collection
              </p>
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-md p-4 font-mono text-sm">
                  <div className="text-muted-foreground mb-2">// Example validation schema</div>
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(
                      {
                        $jsonSchema: {
                          bsonType: "object",
                          required: ["name", "email"],
                          properties: {
                            name: { bsonType: "string", description: "must be a string and is required" },
                            email: {
                              bsonType: "string",
                              pattern: "^.+@.+$",
                              description: "must be a valid email",
                            },
                          },
                        },
                      },
                      null,
                      2,
                    )}
                  </pre>
                </div>
                <Button className="w-full sm:w-auto">
                  <Shield className="w-4 h-4 mr-2" />
                  Update Validation
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rules" className="flex-1 overflow-y-auto m-0 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Security Rules</h3>
                  <p className="text-sm text-muted-foreground">Define access control rules for this collection</p>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rule
                </Button>
              </div>

              <div className="space-y-4">
                <div className="bg-muted/30 rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      <span className="font-mono text-sm font-medium">Read Access</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="bg-background rounded p-3 font-mono text-xs">
                    <div className="text-muted-foreground mb-1">// Allow read if user is authenticated</div>
                    <code className="text-primary">@request.auth.id != null</code>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      <span className="font-mono text-sm font-medium">Write Access</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="bg-background rounded p-3 font-mono text-xs">
                    <div className="text-muted-foreground mb-1">// Allow write if user owns the document</div>
                    <code className="text-primary">@request.auth.id == @resource.data.userId</code>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      <span className="font-mono text-sm font-medium">Admin Access</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="bg-background rounded p-3 font-mono text-xs">
                    <div className="text-muted-foreground mb-1">// Allow full access for admin role</div>
                    <code className="text-primary">@request.auth.role == &quot;admin&quot;</code>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      <span className="font-mono text-sm font-medium">Custom Validation</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="bg-background rounded p-3 font-mono text-xs space-y-1">
                    <div className="text-muted-foreground">// Complex rule with multiple conditions</div>
                    <code className="text-primary block">@request.auth.id != null</code>
                    <code className="text-primary block">&& @resource.data.status == &quot;active&quot;</code>
                    <code className="text-primary block">&& @request.time &lt; @resource.data.expiresAt</code>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-md">
                <h4 className="text-sm font-semibold mb-2 text-blue-600 dark:text-blue-400">Available Variables</h4>
                <div className="space-y-1 text-xs font-mono">
                  <div>
                    <code className="text-primary">@request.auth.id</code>
                    <span className="text-muted-foreground ml-2">- Current user ID</span>
                  </div>
                  <div>
                    <code className="text-primary">@request.auth.role</code>
                    <span className="text-muted-foreground ml-2">- Current user role</span>
                  </div>
                  <div>
                    <code className="text-primary">@resource.data</code>
                    <span className="text-muted-foreground ml-2">- Document data</span>
                  </div>
                  <div>
                    <code className="text-primary">@request.time</code>
                    <span className="text-muted-foreground ml-2">- Current timestamp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {(editingDoc || isCreating) && (
        <DocumentEditor
          dbName={dbName}
          collectionName={collectionName}
          document={editingDoc}
          onClose={() => {
            setEditingDoc(null)
            setIsCreating(false)
          }}
        />
      )}
    </div>
  )
}
