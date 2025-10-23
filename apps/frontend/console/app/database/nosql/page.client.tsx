"use client";

import { DatabaseLayout } from "@/components/database/DatabaseLayout";
import React from "react";
import MongoDBPanel from "../components/mongodb-panel";

interface PageClientProps {
  //
}

const PageClient: React.FC<PageClientProps> = ({}) => {
  return (
    <DatabaseLayout>
    <MongoDBPanel />
    </DatabaseLayout>
  );
};

export default PageClient;
