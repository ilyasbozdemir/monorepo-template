"use client"

import { useState, useEffect } from "react"
import { X, Save, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useMongoStore } from "@/store/mongo-store"

interface DocumentEditorProps {
  dbName: string
  collectionName: string
  document: any | null
  onClose: () => void
}

export default function DocumentEditor({ dbName, collectionName, document, onClose }: DocumentEditorProps) {
  const { addDocument, updateDocument } = useMongoStore()
  const [jsonText, setJsonText] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (document) {
      setJsonText(JSON.stringify(document, null, 2))
    } else {
      setJsonText("{\n  \n}")
    }
  }, [document])

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonText)
      if (document) {
        updateDocument(dbName, collectionName, document._id, parsed)
        console.log(`[MongoDB] Updated document ${document._id} in ${dbName}.${collectionName}`)
      } else {
        addDocument(dbName, collectionName, parsed)
        console.log(`[MongoDB] Added new document to ${dbName}.${collectionName}`)
      }
      setError("")
      onClose()
    } catch (err) {
      setError("Invalid JSON format. Please check your syntax.")
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-3xl max-h-[85vh] flex flex-col shadow-lg">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/30">
          <div>
            <h3 className="font-semibold text-sm">{document ? "Edit Document" : "Insert Document"}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {dbName}.{collectionName}
            </p>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose} className="h-7 w-7">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Editor */}
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          {error && (
            <Alert variant="destructive" className="mb-3">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex-1 border border-border rounded overflow-hidden">
            <textarea
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value)
                setError("")
              }}
              className="w-full h-full bg-background text-foreground font-mono text-xs p-3 focus:outline-none resize-none"
              placeholder='{\n  "field": "value"\n}'
              spellCheck={false}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border flex justify-between items-center bg-muted/30">
          <div className="text-xs text-muted-foreground">ygun tırnak işaretleri ve virgüllerle geçerli JSON biçimini kullanın</div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} size="sm" className="h-8 text-xs bg-transparent">
              İptal Et
            </Button>
            <Button onClick={handleSave} size="sm" className="h-8 text-xs bg-primary hover:bg-primary/90">
              <Save className="w-3 h-3 mr-1" />
              {document ? "Güncelle" : "Ekle"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
