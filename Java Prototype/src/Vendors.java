import java.io.File;

public class Vendors {
    public Vendors() {
        System.out.println();
        System.out.println("Updating Products...");

        File file = new File("Prototype\\assets\\products.txt");
        try {
            if (!file.createNewFile()) {
                if (file.delete() && file.createNewFile()) System.out.println("Created products.txt");
            }
        } catch (Exception e) {
            System.out.println("Failed to Create products.txt");
            return;
        }

        new Vendor_DynaQuest();

        System.out.println();
        System.out.println("Products Updated...");
    }
}