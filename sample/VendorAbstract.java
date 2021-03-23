abstract class VendorAbstract {
    public String getAtrValue(String attribute, String text) {
        String temp = text.substring(text.indexOf(attribute) + attribute.length() + 2);
        return temp.substring(0, temp.indexOf("\""));
    }

    public String getAtrLink(String text) {
        return getAtrValue("href", text);
    }

    public String getAtrContent(String text) {
        return getAtrValue("content", text);
    }
}