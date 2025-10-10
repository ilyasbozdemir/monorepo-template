import { DatabaseLayout } from "@/components/database/DatabaseLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Clock, Database, Edit, Plus, Trash2 } from "lucide-react"

export default function ActivityPage() {
  const activities = [
    {
      id: 1,
      action: "Created collection",
      collection: "products",
      time: "2 minutes ago",
      type: "create",
      icon: Plus,
    },
    {
      id: 2,
      action: "Updated document",
      collection: "users",
      time: "5 minutes ago",
      type: "update",
      icon: Edit,
    },
    {
      id: 3,
      action: "Deleted collection",
      collection: "temp_data",
      time: "15 minutes ago",
      type: "delete",
      icon: Trash2,
    },
    {
      id: 4,
      action: "Created collection",
      collection: "orders",
      time: "1 hour ago",
      type: "create",
      icon: Plus,
    },
    {
      id: 5,
      action: "Updated document",
      collection: "categories",
      time: "2 hours ago",
      type: "update",
      icon: Edit,
    },
  ]

  const getActionColor = (type: string) => {
    switch (type) {
      case "create":
        return "bg-green-100 text-green-800"
      case "update":
        return "bg-blue-100 text-blue-800"
      case "delete":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DatabaseLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activity Log</h1>
          <p className="text-muted-foreground">Recent collection and document changes</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest changes to your collections and documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-muted">
                      <activity.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Database className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{activity.collection}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getActionColor(activity.type)}>{activity.type}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DatabaseLayout>
  )
}
