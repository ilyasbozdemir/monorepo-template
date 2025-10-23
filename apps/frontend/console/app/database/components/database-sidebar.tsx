"use client"

import { useState } from "react"
import {
  ChevronRight,
  ChevronDown,
  Database,
  Folder,
  RefreshCw,
  MoreHorizontal,
  Search,
  Terminal,
  Plus,
  Settings,
  PlugZap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DatabaseSidebarProps {
  databases: Record<string, { collections: Record<string, any[]> }>
  selectedDb: string | null
  selectedCollection: string | null
  onSelectDb: (db: string) => void
  onSelectCollection: (collection: string) => void
}

export default function DatabaseSidebar({
  databases,
  selectedDb,
  selectedCollection,
  onSelectDb,
  onSelectCollection,
}: DatabaseSidebarProps) {
  const [connectionExpanded, setConnectionExpanded] = useState(true)
  const [expandedDbs, setExpandedDbs] = useState<Set<string>>(new Set(["TESTDB"]))
  const [searchQuery, setSearchQuery] = useState("")

  const toggleDb = (dbName: string) => {
    const newExpanded = new Set(expandedDbs)
    if (newExpanded.has(dbName)) {
      newExpanded.delete(dbName)
    } else {
      newExpanded.add(dbName)
    }
    setExpandedDbs(newExpanded)
  }

  const handleDbClick = (dbName: string) => {
    onSelectDb(dbName)
    if (!expandedDbs.has(dbName)) {
      toggleDb(dbName)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Connection Header */}
      <div
        className="flex items-center gap-2 px-3 py-2 hover:bg-sidebar-accent cursor-pointer group"
        onClick={() => setConnectionExpanded(!connectionExpanded)}
      >
        {connectionExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
        <Database className="w-4 h-4 text-primary" />
        <span className="flex-1 text-sm font-medium">localhost:27017</span>

        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            console.log("Yeni DB oluştura tıklandı")
          }}
          title="Yeni DB"
        >
          <Plus className="w-3 h-3" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            console.log("Sorgu Akışıına tıklandı")
          }}
          title="Sorgu Akışını Çalıştır"
        >
          <Terminal className="w-3 h-3" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            console.log("Yenile tıklandı")
          }}
          title="Yenile"
        >
          <RefreshCw className="w-3 h-3" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => console.log("New Database")}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Database
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Run Aggregation")}>
              <Terminal className="w-4 h-4 mr-2" />
              Sorgu Akışını Çalıştır
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Refresh Connection")}>
              <RefreshCw className="w-4 h-4 mr-2" />
             Bağlantıyı Yenile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log("Connection Settings")}>
              <Settings className="w-4 h-4 mr-2" />
             Bağlantı Ayarları
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Disconnect")} className="text-destructive">
              <PlugZap className="w-4 h-4 mr-2" />
              Bağlantıyı Kes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {connectionExpanded && (
        <>
          {/* Search */}
          <div className="px-3 py-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <Input
                placeholder="Search connections"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-7 text-xs pl-7 bg-sidebar-accent border-sidebar-border"
              />
            </div>
          </div>

          {/* Databases Tree */}
          <div className="flex-1 overflow-y-auto">
            <div className="ml-6">
              {Object.entries(databases).map(([dbName, db]) => (
                <div key={dbName}>
                  <div
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 hover:bg-sidebar-accent cursor-pointer group rounded-sm",
                      selectedDb === dbName && !selectedCollection && "bg-sidebar-accent",
                    )}
                    onClick={() => handleDbClick(dbName)}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleDb(dbName)
                      }}
                      className="flex items-center"
                    >
                      {expandedDbs.has(dbName) ? (
                        <ChevronDown className="w-3 h-3 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-muted-foreground" />
                      )}
                    </button>
                    <Database className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="flex-1 text-sm">{dbName}</span>
                  </div>

                  {expandedDbs.has(dbName) && (
                    <div className="ml-4">
                      {Object.keys(db.collections).length === 0 ? (
                        <div className="px-3 py-1.5 text-xs text-muted-foreground">No collections</div>
                      ) : (
                        Object.entries(db.collections).map(([collName, docs]) => (
                          <div
                            key={collName}
                            className={cn(
                              "flex items-center gap-2 px-3 py-1.5 hover:bg-sidebar-accent cursor-pointer rounded-sm",
                              selectedCollection === collName && selectedDb === dbName && "bg-sidebar-accent",
                            )}
                            onClick={() => {
                              onSelectDb(dbName)
                              onSelectCollection(collName)
                            }}
                          >
                            <Folder className="w-3.5 h-3.5 text-muted-foreground ml-3" />
                            <span className="flex-1 text-sm">{collName}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
