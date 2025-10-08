"use client"

import { useState } from "react"
import {
  DatabaseIcon,
  HardDrive,
  FileText,
  ChevronDown,
  ChevronRight,
  Server,
  Folder,
  FolderOpen,
  Shield,
  Code2,
  Lock,
  Eye,
  Plus,
  Edit,
  Trash2,
  List,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Types
type DatabaseProvider = "mongodb" | "postgres" | "firebase" | "memory"
type DatabaseEnvironment = "PRODUCTION" | "STAGING" | "TEST" | "DEVELOPMENT"

interface GlobalPolicyRule {
  action: "read" | "create" | "update" | "delete"
  condition: string
  allow: boolean
}

interface IndexDefinition {
  keys: Record<string, 1 | -1>
  unique?: boolean
  sparse?: boolean
  expireAfterSeconds?: number
}

interface CollectionRule {
  listRule?: string
  viewRule?: string
  createRule?: string
  updateRule?: string
  deleteRule?: string
}

interface SubCollection {
  name: string
  description?: string
  parent?: string
}

interface Collection {
  name: string
  description?: string
  system?: boolean
  createdAt?: number
  subCollections?: SubCollection[]
  rules?: CollectionRule
  indexes?: IndexDefinition[]
}

interface DatabaseDefinition {
  name: string
  collections: Collection[]
  provider: DatabaseProvider
  environment: DatabaseEnvironment
  globalPolicy?: GlobalPolicyRule[]
}

export interface DatabaseSummary {
  database: string
  collectionCount: number
  collections: CollectionSummary[]
}

export interface CollectionSummary {
  name: string
  documentCount: number
  sizeMB?: number
  storageMB?: number
  rules?: {
    listRule?: string
    viewRule?: string
    createRule?: string
    updateRule?: string
    deleteRule?: string
  }
}

// Database definitions
const databases: DatabaseDefinition[] = [
  {
    name: "mainappdb",
    provider: "mongodb",
    environment: "PRODUCTION",
    globalPolicy: [
      { action: "read", condition: "@request.auth.id != null", allow: true },
      {
        action: "create",
        condition: "@request.auth.roles contains 'editor'",
        allow: true,
      },
    ],
    collections: [
      {
        name: "car_listings",
        description: "Araç ilanları",
        system: false,
        createdAt: Date.now(),
        subCollections: [
          { name: "car_listings_photos", parent: "car_listings" },
          { name: "car_listings_videos", parent: "car_listings" },
          { name: "car_listings_notes", parent: "car_listings" },
          { name: "car_listings_selectedEquipmentFeatures", parent: "car_listings" },
        ],
        rules: {
          listRule: "@request.auth.id != null",
          viewRule: "@request.auth.id != null",
          createRule: "@request.auth.id != ''",
          updateRule: "@request.auth.id = @record.author",
          deleteRule: "@request.auth.id = @record.author",
        },
        indexes: [{ keys: { listingId: 1 }, unique: true }, { keys: { createdAt: -1 } }],
      },
      {
        name: "medias",
        description: "Medya dosyaları",
        system: true,
        createdAt: Date.now(),
        subCollections: [{ name: "medias_thumbnails", parent: "medias" }],
        rules: {
          listRule: "@request.auth.id != null",
          viewRule: "@request.auth.id != null",
          createRule: "@request.auth.roles contains 'admin'",
        },
      },
      {
        name: "users",
        description: "Kullanıcılar",
        system: false,
        createdAt: Date.now(),
        subCollections: [
          { name: "users_profiles", parent: "users" },
          { name: "users_settings", parent: "users" },
        ],
        rules: {
          listRule: "@request.auth.roles contains 'admin'",
          viewRule: "@request.auth.id = @record.id",
          updateRule: "@request.auth.id = @record.id",
        },
      },
      {
        name: "sessions",
        description: "Oturum bilgileri",
        system: true,
        createdAt: Date.now(),
        rules: {
          listRule: "@request.auth.roles contains 'admin'",
          viewRule: "@request.auth.id = @record.userId",
          deleteRule: "@request.auth.id = @record.userId",
        },
      },
    ],
  },
  {
    name: "staging-mainappdb",
    provider: "mongodb",
    environment: "STAGING",
    collections: [
      {
        name: "car_listings",
        description: "Araç ilanları (test)",
        system: false,
        createdAt: Date.now(),
        subCollections: [{ name: "car_listings_photos", parent: "car_listings" }],
        rules: {
          listRule: "@request.auth.id != null",
          createRule: "@request.auth.id != ''",
        },
        indexes: [{ keys: { listingId: 1 }, unique: true }],
      },
      {
        name: "medias",
        description: "Medya dosyaları (test)",
        system: true,
        createdAt: Date.now(),
        subCollections: [{ name: "medias_thumbnails", parent: "medias" }],
      },
      {
        name: "users",
        description: "Test kullanıcıları",
        system: false,
        createdAt: Date.now(),
      },
      {
        name: "test_data",
        description: "Test verileri",
        system: false,
        createdAt: Date.now(),
      },
    ],
  },
]

// Mock data with flat structure
const mockDatabases: DatabaseSummary[] = [
  {
    database: "mainappdb",
    collectionCount: 11,
    collections: [
      { name: "car_listings", documentCount: 1247, sizeMB: 45.2, storageMB: 52.8 },
      { name: "car_listings/photos", documentCount: 3891, sizeMB: 892.4, storageMB: 1024.1 },
      { name: "car_listings/videos", documentCount: 234, sizeMB: 1567.8, storageMB: 1890.2 },
      { name: "car_listings/notes", documentCount: 892, sizeMB: 12.3, storageMB: 15.7 },
      { name: "car_listings/selectedEquipmentFeatures", documentCount: 1247, sizeMB: 8.9, storageMB: 11.2 },
      { name: "medias", documentCount: 4521, sizeMB: 2341.5, storageMB: 2678.9 },
      { name: "medias/thumbnails", documentCount: 4521, sizeMB: 234.6, storageMB: 289.3 },
      { name: "users", documentCount: 156, sizeMB: 2.4, storageMB: 3.1 },
      { name: "users/profiles", documentCount: 156, sizeMB: 1.8, storageMB: 2.3 },
      { name: "users/settings", documentCount: 156, sizeMB: 0.6, storageMB: 0.8 },
      { name: "sessions", documentCount: 892, sizeMB: 8.9, storageMB: 11.2 },
    ],
  },
  {
    database: "staging-mainappdb",
    collectionCount: 6,
    collections: [
      { name: "car_listings", documentCount: 89, sizeMB: 3.2, storageMB: 4.1 },
      { name: "car_listings/photos", documentCount: 267, sizeMB: 62.4, storageMB: 78.3 },
      { name: "medias", documentCount: 312, sizeMB: 156.7, storageMB: 189.4 },
      { name: "medias/thumbnails", documentCount: 312, sizeMB: 18.9, storageMB: 23.4 },
      { name: "users", documentCount: 23, sizeMB: 0.4, storageMB: 0.6 },
      { name: "test_data", documentCount: 1000, sizeMB: 45.6, storageMB: 56.7 },
    ],
  },
]

interface TreeNode {
  name: string
  fullPath: string
  collection?: CollectionSummary
  children: TreeNode[]
  level: number
}

export default function DatabaseDashboard() {
  const [databaseSummaries] = useState<DatabaseSummary[]>(mockDatabases)
  const [expandedDatabases, setExpandedDatabases] = useState<Set<string>>(new Set(["mainappdb"]))
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const [selectedCollection, setSelectedCollection] = useState<string | null>("car_listings")

  const toggleDatabase = (dbName: string) => {
    const newExpanded = new Set(expandedDatabases)
    if (newExpanded.has(dbName)) {
      newExpanded.delete(dbName)
    } else {
      newExpanded.add(dbName)
    }
    setExpandedDatabases(newExpanded)
  }

  const toggleNode = (dbName: string, nodePath: string) => {
    const key = `${dbName}:${nodePath}`
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedNodes(newExpanded)
  }

  const buildTree = (collections: CollectionSummary[]): TreeNode[] => {
    const root: TreeNode[] = []
    const nodeMap = new Map<string, TreeNode>()

    collections.forEach((collection) => {
      const parts = collection.name.split("/")
      let currentPath = ""

      parts.forEach((part, index) => {
        const parentPath = currentPath
        currentPath = currentPath ? `${currentPath}/${part}` : part
        const level = index

        if (!nodeMap.has(currentPath)) {
          const node: TreeNode = {
            name: part,
            fullPath: currentPath,
            collection: currentPath === collection.name ? collection : undefined,
            children: [],
            level,
          }

          nodeMap.set(currentPath, node)

          if (parentPath) {
            const parent = nodeMap.get(parentPath)
            if (parent) {
              parent.children.push(node)
            }
          } else {
            root.push(node)
          }
        }
      })
    })

    return root
  }

  const TreeNodeComponent = ({
    node,
    dbName,
    isLast,
    parentPrefix,
  }: {
    node: TreeNode
    dbName: string
    isLast: boolean
    parentPrefix: string
  }) => {
    const hasChildren = node.children.length > 0
    const nodeKey = `${dbName}:${node.fullPath}`
    const isExpanded = expandedNodes.has(nodeKey)
    const isFolder = hasChildren || !node.collection
    const isSelected = selectedCollection === node.fullPath

    return (
      <div>
        <div
          className={`group flex items-center gap-2 py-2 hover:bg-muted/30 cursor-pointer ${
            isSelected ? "bg-muted/50" : ""
          }`}
          onClick={() => !isFolder && setSelectedCollection(node.fullPath)}
        >
          {/* Tree lines */}
          <div className="flex items-center font-mono text-muted-foreground/40">
            <span className="inline-block w-4">{parentPrefix}</span>
            <span className="inline-block w-4">{isLast ? "└" : "├"}</span>
            <span className="inline-block w-2">─</span>
          </div>

          {/* Expand/collapse button */}
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                toggleNode(dbName, node.fullPath)
              }}
            >
              {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </Button>
          ) : (
            <div className="h-6 w-6" />
          )}

          {/* Icon */}
          {isFolder ? (
            isExpanded ? (
              <FolderOpen className="h-4 w-4 text-primary" />
            ) : (
              <Folder className="h-4 w-4 text-primary" />
            )
          ) : (
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          )}

          {/* Name */}
          <span className="font-mono text-sm text-foreground">{node.name}</span>

          {/* Stats */}
          {node.collection && (
            <div className="ml-auto flex items-center gap-4 pr-4">
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {node.collection.documentCount.toLocaleString()} docs
              </span>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {formatSize(node.collection.sizeMB)}
              </span>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {formatSize(node.collection.storageMB)}
              </span>
            </div>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child, index) => (
              <TreeNodeComponent
                key={child.fullPath}
                node={child}
                dbName={dbName}
                isLast={index === node.children.length - 1}
                parentPrefix={parentPrefix + (isLast ? "  " : "│ ")}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  const formatSize = (mb?: number) => {
    if (!mb) return "N/A"
    if (mb < 1) return `${(mb * 1024).toFixed(1)} KB`
    if (mb > 1024) return `${(mb / 1024).toFixed(2)} GB`
    return `${mb.toFixed(1)} MB`
  }

  const getTotalDocuments = (db: DatabaseSummary) => {
    return db.collections.reduce((sum, col) => sum + col.documentCount, 0)
  }

  const getTotalSize = (db: DatabaseSummary) => {
    return db.collections.reduce((sum, col) => sum + (col.sizeMB || 0), 0)
  }

  // Get collection details from database definitions
  const getCollectionDetails = (collectionName: string): Collection | undefined => {
    // Remove sub-collection path to get base collection name
    const baseName = collectionName.split("/")[0]

    for (const db of databases) {
      const collection = db.collections.find((c) => c.name === baseName)
      if (collection) return collection
    }
    return undefined
  }

  const selectedCollectionDetails = selectedCollection ? getCollectionDetails(selectedCollection) : null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <DatabaseIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Database Management</h1>
                <p className="text-sm text-muted-foreground">Monitor collections, rules, and SDK integration</p>
              </div>
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              <Server className="mr-1.5 h-3 w-3" />
              MongoDB
            </Badge>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground">
                Total Databases
              </CardDescription>
              <CardTitle className="text-3xl font-bold tabular-nums text-foreground">
                {databaseSummaries.length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground">
                Total Collections
              </CardDescription>
              <CardTitle className="text-3xl font-bold tabular-nums text-foreground">
                {databaseSummaries.reduce((sum, db) => sum + db.collectionCount, 0)}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground">
                Total Documents
              </CardDescription>
              <CardTitle className="text-3xl font-bold tabular-nums text-foreground">
                {databaseSummaries.reduce((sum, db) => sum + getTotalDocuments(db), 0).toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Panel - Database Tree */}
          <div className="lg:col-span-2 space-y-4">
            {databaseSummaries.map((db) => {
              const isExpanded = expandedDatabases.has(db.database)
              const totalDocs = getTotalDocuments(db)
              const totalSize = getTotalSize(db)
              const tree = buildTree(db.collections)

              return (
                <Card key={db.database} className="border-border bg-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleDatabase(db.database)}
                        >
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                        <div>
                          <CardTitle className="flex items-center gap-2 text-lg font-mono">
                            <HardDrive className="h-4 w-4 text-primary" />
                            {db.database}
                          </CardTitle>
                          <CardDescription className="mt-1 text-xs">
                            {db.collectionCount} collections • {totalDocs.toLocaleString()} documents
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className="font-mono text-xs">
                          {formatSize(totalSize)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="pt-0">
                      <div className="overflow-hidden rounded-lg border border-border bg-muted/20 p-4">
                        {/* Column headers */}
                        <div className="mb-2 flex items-center gap-2 border-b border-border pb-2">
                          <div className="flex items-center gap-2 font-mono text-muted-foreground">
                            <span className="inline-block w-4"></span>
                            <span className="inline-block w-4"></span>
                            <span className="inline-block w-2"></span>
                          </div>
                          <div className="h-6 w-6" />
                          <div className="h-4 w-4" />
                          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Collection
                          </span>
                          <div className="ml-auto flex items-center gap-4 pr-4">
                            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Documents
                            </span>
                            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Size
                            </span>
                            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Storage
                            </span>
                          </div>
                        </div>

                        {/* Tree view */}
                        {tree.map((node, index) => (
                          <TreeNodeComponent
                            key={node.fullPath}
                            node={node}
                            dbName={db.database}
                            isLast={index === tree.length - 1}
                            parentPrefix=""
                          />
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>

          {/* Right Panel - Rules & SDK */}
          <div className="space-y-4">
            {selectedCollectionDetails ? (
              <>
                {/* Collection Rules */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Shield className="h-4 w-4 text-primary" />
                      Collection Rules
                    </CardTitle>
                    <CardDescription className="text-xs">Access control rules for {selectedCollection}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedCollectionDetails.rules ? (
                      <>
                        {selectedCollectionDetails.rules.listRule && (
                          <Collapsible>
                            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/30 p-3 hover:bg-muted/50">
                              <div className="flex items-center gap-2">
                                <List className="h-3.5 w-3.5 text-blue-500" />
                                <span className="font-mono text-xs font-medium">listRule</span>
                              </div>
                              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2 rounded-lg border border-border bg-muted/20 p-3">
                              <code className="font-mono text-xs text-foreground">
                                {selectedCollectionDetails.rules.listRule}
                              </code>
                            </CollapsibleContent>
                          </Collapsible>
                        )}

                        {selectedCollectionDetails.rules.viewRule && (
                          <Collapsible>
                            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/30 p-3 hover:bg-muted/50">
                              <div className="flex items-center gap-2">
                                <Eye className="h-3.5 w-3.5 text-green-500" />
                                <span className="font-mono text-xs font-medium">viewRule</span>
                              </div>
                              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2 rounded-lg border border-border bg-muted/20 p-3">
                              <code className="font-mono text-xs text-foreground">
                                {selectedCollectionDetails.rules.viewRule}
                              </code>
                            </CollapsibleContent>
                          </Collapsible>
                        )}

                        {selectedCollectionDetails.rules.createRule && (
                          <Collapsible>
                            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/30 p-3 hover:bg-muted/50">
                              <div className="flex items-center gap-2">
                                <Plus className="h-3.5 w-3.5 text-emerald-500" />
                                <span className="font-mono text-xs font-medium">createRule</span>
                              </div>
                              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2 rounded-lg border border-border bg-muted/20 p-3">
                              <code className="font-mono text-xs text-foreground">
                                {selectedCollectionDetails.rules.createRule}
                              </code>
                            </CollapsibleContent>
                          </Collapsible>
                        )}

                        {selectedCollectionDetails.rules.updateRule && (
                          <Collapsible>
                            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/30 p-3 hover:bg-muted/50">
                              <div className="flex items-center gap-2">
                                <Edit className="h-3.5 w-3.5 text-amber-500" />
                                <span className="font-mono text-xs font-medium">updateRule</span>
                              </div>
                              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2 rounded-lg border border-border bg-muted/20 p-3">
                              <code className="font-mono text-xs text-foreground">
                                {selectedCollectionDetails.rules.updateRule}
                              </code>
                            </CollapsibleContent>
                          </Collapsible>
                        )}

                        {selectedCollectionDetails.rules.deleteRule && (
                          <Collapsible>
                            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/30 p-3 hover:bg-muted/50">
                              <div className="flex items-center gap-2">
                                <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                <span className="font-mono text-xs font-medium">deleteRule</span>
                              </div>
                              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2 rounded-lg border border-border bg-muted/20 p-3">
                              <code className="font-mono text-xs text-foreground">
                                {selectedCollectionDetails.rules.deleteRule}
                              </code>
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                      </>
                    ) : (
                      <div className="rounded-lg border border-dashed border-border p-4 text-center">
                        <Lock className="mx-auto h-8 w-8 text-muted-foreground/50" />
                        <p className="mt-2 text-xs text-muted-foreground">No rules defined</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* SDK Examples */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Code2 className="h-4 w-4 text-primary" />
                      SDK Examples
                    </CardTitle>
                    <CardDescription className="text-xs">Code snippets for {selectedCollection}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="getAll" className="w-full">
                      <TabsList className="grid w-full grid-cols-5 text-xs">
                        <TabsTrigger value="getAll" className="text-xs">
                          Get All
                        </TabsTrigger>
                        <TabsTrigger value="getById" className="text-xs">
                          Get By ID
                        </TabsTrigger>
                        <TabsTrigger value="insert" className="text-xs">
                          Insert
                        </TabsTrigger>
                        <TabsTrigger value="update" className="text-xs">
                          Update
                        </TabsTrigger>
                        <TabsTrigger value="delete" className="text-xs">
                          Delete
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="getAll" className="mt-4">
                        <div className="space-y-3">
                          <div className="rounded-lg border border-border bg-muted/20 p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-xs font-medium text-muted-foreground">Get All Documents</span>
                              <Badge variant="outline" className="text-xs">
                                Paginated
                              </Badge>
                            </div>
                            <pre className="overflow-x-auto text-xs">
                              <code className="font-mono text-foreground">{`const result = await db
  .collection('${selectedCollection}')
  .getAll(1, 20);

// Returns:
// {
//   totalCount: number,
//   page: number,
//   size: number,
//   isPrevious: boolean,
//   isNext: boolean,
//   data: T[]
// }`}</code>
                            </pre>
                          </div>

                          <div className="rounded-lg border border-border bg-muted/20 p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-xs font-medium text-muted-foreground">Aggregate Pipeline</span>
                              <Badge variant="outline" className="text-xs">
                                Advanced
                              </Badge>
                            </div>
                            <pre className="overflow-x-auto text-xs">
                              <code className="font-mono text-foreground">{`const pipeline = [
  { $match: { status: 'active' } },
  { $sort: { createdAt: -1 } },
  { $limit: 10 }
];

const results = await db
  .collection('${selectedCollection}')
  .aggregate(pipeline);`}</code>
                            </pre>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="getById" className="mt-4">
                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">Get Single Document</span>
                            <Badge variant="outline" className="text-xs">
                              By ID
                            </Badge>
                          </div>
                          <pre className="overflow-x-auto text-xs">
                            <code className="font-mono text-foreground">{`const doc = await db
  .collection('${selectedCollection}')
  .getById(documentId);

if (doc) {
  console.log('Found:', doc);
} else {
  console.log('Not found');
}`}</code>
                          </pre>
                        </div>
                      </TabsContent>

                      <TabsContent value="insert" className="mt-4">
                        <div className="space-y-3">
                          <div className="rounded-lg border border-border bg-muted/20 p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-xs font-medium text-muted-foreground">Insert Single Document</span>
                              <Badge variant="outline" className="text-xs">
                                Create
                              </Badge>
                            </div>
                            <pre className="overflow-x-auto text-xs">
                              <code className="font-mono text-foreground">{`const result = await db
  .collection('${selectedCollection}')
  .insert({
    // your data here
    createdAt: new Date(),
    status: 'active'
  });

// Returns: InsertResponse
console.log(result);`}</code>
                            </pre>
                          </div>

                          <div className="rounded-lg border border-border bg-muted/20 p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-xs font-medium text-muted-foreground">
                                Insert Multiple Documents
                              </span>
                              <Badge variant="outline" className="text-xs">
                                Bulk
                              </Badge>
                            </div>
                            <pre className="overflow-x-auto text-xs">
                              <code className="font-mono text-foreground">{`const docs = [
  { name: 'Item 1', status: 'active' },
  { name: 'Item 2', status: 'active' }
];

const result = await db
  .collection('${selectedCollection}')
  .insertMany(docs);

// Returns: { message: string }
console.log(result.message);`}</code>
                            </pre>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="update" className="mt-4">
                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">Update Document</span>
                            <Badge variant="outline" className="text-xs">
                              By ID
                            </Badge>
                          </div>
                          <pre className="overflow-x-auto text-xs">
                            <code className="font-mono text-foreground">{`const result = await db
  .collection('${selectedCollection}')
  .update(documentId, {
    status: 'updated',
    updatedAt: new Date()
  });

// Returns: { modifiedCount: number }
console.log(\`Modified: \${result.modifiedCount}\`);`}</code>
                          </pre>
                        </div>
                      </TabsContent>

                      <TabsContent value="delete" className="mt-4">
                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">Delete Document</span>
                            <Badge variant="outline" className="text-xs">
                              By ID
                            </Badge>
                          </div>
                          <pre className="overflow-x-auto text-xs">
                            <code className="font-mono text-foreground">{`const result = await db
  .collection('${selectedCollection}')
  .delete(documentId);

// Returns: { deletedCount: number }
if (result.deletedCount > 0) {
  console.log('Document deleted');
} else {
  console.log('Document not found');
}`}</code>
                          </pre>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <DatabaseIcon className="h-12 w-12 text-muted-foreground/30" />
                  <p className="mt-4 text-sm text-muted-foreground">Select a collection to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
