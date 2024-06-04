import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, usePDF, pdf } from "@react-pdf/renderer";
import * as FileSaver from "file-saver";
import { Button } from "flowbite-react";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import { MergeProductsbyKey } from "@/utils/commonUtils";
import moment from "moment";
type Item = Database["public"]["Tables"]["line_items"]["Row"];
type Product = Database["public"]["Tables"]["order_items"]["Row"] & {
  item_id: Item;
};
type Order = Database["public"]["Tables"]["orders"]["Row"];
type ProductArray = [Product];

export default function DownloadPDF({ orderId, id }: { orderId: number; id: number }) {
  const supabase = createClientComponentClient<Database>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function MyDocument({ products }: { products: any }) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {products.map((pr: ProductArray) =>
            pr.map((item) => (
              <View style={styles.section} key={item.id}>
                <Text>{item.room}</Text>
                <Text>{item.item_id.description}</Text>
                <Text>{item.quantity}</Text>
                <Text>{item.price}</Text>
              </View>
            ))
          )}
        </Page>
      </Document>
    );
  }

  const generatePdfDocument = async () => {
    setIsLoading(true);
    let order = await getOrders();
    let products = await getProducts();

    const blob = await pdf(<MyDocument products={products} />).toBlob();
    FileSaver.saveAs(blob, `${order?.project_name}-${moment(order?.created_at).format("MMM DD, YYYY")}`);
    setIsLoading(false);
  };

  async function getOrders() {
    let { data: order, error } = await supabase.from("orders").select("*").eq("id", orderId).single();
    if (order) {
      return order;
    }
  }

  async function getProducts() {
    let { data: products, error } = await supabase.from("order_items").select("*").eq("order_id", id).returns<Product[]>();
    if (products) {
      return MergeProductsbyKey(products, "room");
    }
  }

  return (
    <Button color="light" onClick={() => generatePdfDocument()} isProcessing={isLoading}>
      {!isLoading && <AiOutlineCloudDownload size={20} className="mr-2" />}
      Download
    </Button>
  );
}

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});
