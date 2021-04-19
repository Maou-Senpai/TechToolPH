abstract class VendorAbstract {
    protected final String productsFile = "Prototype\\assets\\products.txt";
    
    protected String getAtrValue(String attribute, String text) {
        String temp = text.substring(text.indexOf(attribute) + attribute.length() + 2);
        return temp.substring(0, temp.indexOf("\""));
    }

    protected String getAtrLink(String text) {
        return getAtrValue("href", text);
    }

    protected String getAtrContent(String text) {
        return getAtrValue("content", text);
    }
}