import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.io.IOException;

public class Vendor_DynaQuest extends VendorAbstract {
    private final String mainURL = "https://dynaquestpc.com";

    public Vendor_DynaQuest() {
        try {
            Document doc = Jsoup.connect("https://dynaquestpc.com/collections/graphics-card").get();
            while (true) {
                traverseProducts(doc);
                Element next = doc.select("link[rel=next]").first();
                if (next != null) {
                    doc = Jsoup.connect(mainURL + getAtrLink(next.toString())).get();
                } else break;
            }
        } catch (IOException e) {
            System.out.println("\nUnable to Connect to Vendor's Site");
        }
    }

    private void traverseProducts(Document doc) {
        for (Element element : doc.select("a[class=title-5]")) {
            scrapeData(mainURL + getAtrLink(element.toString()));
        }
    }

    private void scrapeData(String productURL) {
        while (true) {
            try {
                Document doc = Jsoup.connect(productURL).get();
                String productName = getAtrContent(doc.select("meta[property=og:title]").first().toString());
                String productPrice = getAtrContent(doc.select("meta[property=og:price:amount]").first().toString());
                System.out.println(productName + " - PHP " + productPrice);
                break;
            } catch (Exception e) {
                System.out.println("Cannot Connect to Product Page");
                System.out.print("Press Enter to Try Again...");
                Main.scanner.nextLine();
            }
        }
    }
}