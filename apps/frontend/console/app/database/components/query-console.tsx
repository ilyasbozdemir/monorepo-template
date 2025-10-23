"use client"

import { useState } from "react"
import { Play, Terminal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMongoStore } from "@/store/mongo-store"

interface QueryConsoleProps {
  dbName: string
  collectionName: string
}

export default function QueryConsole({ dbName, collectionName }: QueryConsoleProps) {
  const { databases } = useMongoStore()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [consoleOutput, setConsoleOutput] = useState<string[]>([])

  const executeQuery = () => {
    const timestamp = new Date().toLocaleTimeString()
    const documents = databases[dbName]?.collections[collectionName] || []

    try {
      // Simple query parser
      if (query.trim() === "" || query.trim() === "db.find()" || query.trim() === "find()") {
        setResults(documents)
        setConsoleOutput((prev) => [
          ...prev,
          `[${timestamp}] > ${query || "db.find()"}`,
          `[${timestamp}] Found ${documents.length} documents`,
        ])
      } else if (query.includes("find(")) {
        // Extract filter from find({...})
        const match = query.match(/find$$(.*?)$$/)
        if (match && match[1].trim()) {
          const filter = JSON.parse(match[1])
          const filtered = documents.filter((doc) => {
            return Object.entries(filter).every(([key, value]) => doc[key] === value)
          })
          setResults(filtered)
          setConsoleOutput((prev) => [
            ...prev,
            `[${timestamp}] > ${query}`,
            `[${timestamp}] Found ${filtered.length} documents`,
          ])
        }
      } else if (query.includes("count()")) {
        setResults([])
        setConsoleOutput((prev) => [...prev, `[${timestamp}] > ${query}`, `[${timestamp}] Count: ${documents.length}`])
      } else {
        setConsoleOutput((prev) => [
          ...prev,
          `[${timestamp}] > ${query}`,
          `[${timestamp}] Error: Unknown command. Try: find(), find({field: "value"}), count()`,
        ])
      }
    } catch (err) {
      setConsoleOutput((prev) => [
        ...prev,
        `[${timestamp}] > ${query}`,
        `[${timestamp}] Error: ${err instanceof Error ? err.message : "Invalid query"}`,
      ])
    }
  }

  return (
    <div className="h-80 border-t border-border bg-card flex flex-col">
      <div className="p-3 border-b border-border flex items-center justify-between bg-secondary/30">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Query Console</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setConsoleOutput([])
            setResults([])
          }}
          className="h-7 gap-2"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </Button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-border bg-secondary/20">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && executeQuery()}
              placeholder="db.collection.find({ field: 'value' })"
              className="flex-1 bg-background text-foreground font-mono text-sm px-3 py-2 rounded border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button size="sm" onClick={executeQuery} className="gap-2">
              <Play className="w-4 h-4" />
              Run
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-1">
          {consoleOutput.map((line, i) => (
            <div
              key={i}
              className={
                line.includes("Error")
                  ? "text-destructive"
                  : line.includes(">")
                    ? "text-primary"
                    : "text-muted-foreground"
              }
            >
              {line}
            </div>
          ))}

          {results.length > 0 && (
            <div className="mt-3 space-y-2">
              {results.map((doc, i) => (
                <pre key={i} className="bg-secondary/50 p-2 rounded text-foreground overflow-x-auto">
                  {JSON.stringify(doc, null, 2)}
                </pre>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
