import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, usePDF, pdf } from "@react-pdf/renderer";
import { Button, Card, Toast, Table, Tabs } from "flowbite-react";
import * as FileSaver from "file-saver";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import { MergeProductsbyKey } from "@/utils/commonUtils";
import moment from "moment";
import { numberWithCommas } from "@/utils/commonUtils";
import request from "@/utils/request";
import { Scope, ScopeItemRevision } from "@/types";


export default function DownloadPDF({ scopeItemRevision, order }: { scopeItemRevision: ScopeItemRevision, order: Scope }) {
  const supabase = createClientComponentClient<Database>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function MyDocument({ products }: { products: any }) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {products.map((item: any) =>
            item.map((product: any) => (
              <View key={item[0].id} style={styles.card}>
                <Text style={styles.header}>{item[0].area}</Text>
                <View style={styles.section} key={product.id}>
                  <Text>{product.area}</Text>
                  {/* <Text>{product.item_id.description}</Text> */}
                  <Text>{product.quantity}</Text>
                  <Text>{product.targetClientPrice}</Text>
                </View>
              </View>
            ))
          )}
        </Page>
      </Document>
    );
  }

  const generatePdfDocument = async () => {
    setIsLoading(true);
 
    const products =  MergeProductsbyKey(scopeItemRevision.scopeItems, "area")

    const blob = await pdf(<MyDocument products={products} />).toBlob();
    FileSaver.saveAs(blob, `${order.projectName}-${moment(order.createdAt).format("MMM DD, YYYY")}`);
    setIsLoading(false);
  };

  return (
    <Button color="light" onClick={() => generatePdfDocument()} isProcessing={isLoading} className="h-fit">
      {!isLoading && <AiOutlineCloudDownload size={20} className="mr-2" />}
      Download
    </Button>
  );
}

// Create styles
const styles = StyleSheet.create({
  page: {
    // flexDirection: "column",
    backgroundColor: "#E4E4E4",
    fontSize: 14,
    // margin: 20,
  },
  // max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700
  card: {
    // padding: 24,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "rgb(229 231 235)",
  },
  header: {
    // marginBottom: 8,
    fontSize: 16,
    fontWeight: "bold",
    // lineHeight: 32,
    // fontWeight: "semibold",
    // textAlign: "center",
    // color: "#111827",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});
