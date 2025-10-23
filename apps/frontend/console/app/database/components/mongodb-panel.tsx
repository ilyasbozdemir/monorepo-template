"use client";

import { useState } from "react";
import {
  Database,
  Plus,
  RefreshCw,
  Settings,
  LayoutGrid,
  List,
  Menu,
  X,
  MoreVertical,
  Terminal,
  PlugZap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DatabaseSidebar from "./database-sidebar";
import CollectionView from "./collection-view";
import SettingsModal from "./settings-modal";

import { Card } from "@/components/ui/card";
import { useMongoStore } from "@/store/mongo-store";

type ViewMode = "list" | "grid";

export default function MongoDBPanel() {
  const { databases, addDatabase, getDatabaseStats } = useMongoStore();
  const [selectedDb, setSelectedDb] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );
  const [newDbName, setNewDbName] = useState("");
  const [showNewDb, setShowNewDb] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sortBy, setSortBy] = useState("name");
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleAddDatabase = () => {
    if (newDbName.trim()) {
      addDatabase(newDbName.trim());
      setNewDbName("");
      setShowNewDb(false);
    }
  };

  const sortedDatabases = Object.keys(databases).sort((a, b) => {
    if (sortBy === "name") return a.localeCompare(b);
    return 0;
  });

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:relative inset-y-0 left-0 z-50
        w-64 border-r border-border bg-sidebar flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex items-center justify-between p-3 border-b border-border lg:hidden">
          <h2 className="text-xs font-semibold text-muted-foreground">
            Bağlantılar (1)
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setShowSidebar(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Connection Actions Dropdown Menu */}
        <div className="p-3 border-b border-border hidden lg:flex items-center justify-between">
          <h2 className="text-xs font-semibold text-muted-foreground">
            Bağlantılar (1)
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setShowNewDb(true)}>
                <Plus className="w-4 h-4 mr-2" />
                DB Oluştur
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Run Aggregation")}>
                <Terminal className="w-4 h-4 mr-2" />
               Sorgu Akışını Çalıştır
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowSettings(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Yapılandırma
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Disconnect")}>
                <PlugZap className="w-4 h-4 mr-2" />
                Bağlantıyı Kes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DatabaseSidebar
          databases={databases}
          selectedDb={selectedDb}
          selectedCollection={selectedCollection}
          onSelectDb={(db) => {
            setSelectedDb(db);
            setShowSidebar(false);
          }}
          onSelectCollection={(col) => {
            setSelectedCollection(col);
            setShowSidebar(false);
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="border-b border-border bg-card px-2 sm:px-4 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 lg:hidden shrink-0"
              onClick={() => setShowSidebar(true)}
            >
              <Menu className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2 text-sm min-w-0 overflow-hidden">
              <Database className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="font-medium truncate">localhost:27017</span>
              {selectedDb && (
                <>
                  <span className="text-muted-foreground hidden sm:inline">
                    /
                  </span>
                  <span className="text-sm font-medium truncate hidden sm:inline">
                    {selectedDb}
                  </span>
                </>
              )}
              {selectedCollection && (
                <>
                  <span className="text-muted-foreground hidden md:inline">
                    /
                  </span>
                  <span className="text-sm font-medium truncate hidden md:inline">
                    {selectedCollection}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs bg-transparent hidden sm:flex"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">Ayarlar</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-transparent sm:hidden"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="w-3 h-3" />
            </Button>

            <Button
              variant="default"
              size="sm"
              className="h-8 text-xs bg-primary hover:bg-primary/90 hidden sm:flex"
              onClick={() => setShowNewDb(!showNewDb)}
            >
              <Plus className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline"> DB Oluştur</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              className="h-8 w-8 p-0 bg-primary hover:bg-primary/90 sm:hidden"
              onClick={() => setShowNewDb(!showNewDb)}
            >
              <Plus className="w-3 h-3" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-transparent"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* New Database Dialog */}
        {showNewDb && (
          <div className="border-b border-border bg-muted/50 px-2 sm:px-4 py-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-md">
              <Input
                placeholder="Veritabanı Adı"
                value={newDbName}
                onChange={(e) => setNewDbName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddDatabase()}
                className="h-8 text-sm"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddDatabase}
                  className="h-8 flex-1 sm:flex-none"
                >
                  Oluştur
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowNewDb(false);
                    setNewDbName("");
                  }}
                  className="h-8 flex-1 sm:flex-none"
                >
                  İptal
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        {selectedDb && selectedCollection ? (
          <CollectionView
            dbName={selectedDb}
            collectionName={selectedCollection}
          />
        ) : selectedDb ? (
          <div className="flex-1 overflow-auto p-2 sm:p-4">
            <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-40 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Veritabanı Adı</SelectItem>
                    <SelectItem value="size">Depolama Boyutu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-1 border border-border rounded-md self-end">
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {sortedDatabases.map((dbName) => {
                const stats = getDatabaseStats(dbName);
                return (
                  <Card
                    key={dbName}
                    className="p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer border border-border"
                    onClick={() => setSelectedDb(dbName)}
                  >
                    <h3 className="font-semibold text-primary mb-3 text-sm sm:text-base">
                      {dbName}
                    </h3>
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground text-xs mb-1">
                         Depolama Boyutu:
                        </div>
                        <div className="font-medium text-xs sm:text-sm">
                          {stats.storageSize}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs mb-1">
                          Koleksiyonlar:
                        </div>
                        <div className="font-medium text-xs sm:text-sm">
                          {stats.collectionsCount}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs mb-1">
                          Veritabanı İndeksleri:
                        </div>
                        <div className="font-medium text-xs sm:text-sm">
                          {stats.indexesCount}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center text-muted-foreground">
              <Database className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-20" />
              <p className="text-base sm:text-lg font-medium">
                Başlamak için bir veritabanı seçin
              </p>
              <p className="text-xs sm:text-sm mt-2">
               Kenar çubuğundan bir veritabanı seçin
              </p>
            </div>
          </div>
        )}
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
