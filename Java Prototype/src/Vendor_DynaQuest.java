import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.io.FileWriter;
import java.util.HashMap;

public class Vendor_DynaQuest extends VendorAbstract {
    private final String mainURL = "https://dynaquestpc.com";
    HashMap<PCComponents, String> componentLinks = new HashMap<>();

    public Vendor_DynaQuest() {
        componentLinks.put(PCComponents.PROCESSOR, "https://dynaquestpc.com/collections/processor");
        componentLinks.put(PCComponents.MEMORY, "https://dynaquestpc.com/collections/memory");
        componentLinks.put(PCComponents.MOTHERBOARD, "https://dynaquestpc.com/collections/motherboard");
        componentLinks.put(PCComponents.GRAPHICS_CARD, "https://dynaquestpc.com/collections/graphics-card");

        for (PCComponents comp : componentLinks.keySet()) productsListPage(comp);
    }

    private void productsListPage(PCComponents component) {
        while (true) {
            try {
                FileWriter fileWriter = new FileWriter(productsFile, true);
                fileWriter.append(component.toString()).append("\n");
                fileWriter.close();
                System.out.println();
                System.out.println(component.toString());

                Document doc = Jsoup.connect(componentLinks.get(component)).get();
                do {
                    traverseProducts(doc);
                    Element next = doc.select("link[rel=next]").first();
                    if (next != null) doc = Jsoup.connect(mainURL + getAtrLink(next.toString())).get();
                    else doc = null;
                } while (doc != null);
                break;
            } catch (Exception e) {
                System.out.println("\nUnable to Connect to Vendor's Site");
                System.out.print("Press Enter to Try Again...");
                Main.scanner.nextLine();
            }
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
                FileWriter fileWriter = new FileWriter(productsFile, true);
                fileWriter.append(productName).append(" - PHP ").append(productPrice).append("\n");
                fileWriter.close();
                break;
            } catch (Exception e) {
                System.out.println("Cannot Connect to Product Page");
                System.out.print("Press Enter to Try Again...");
                Main.scanner.nextLine();
            }
        }
    }
}