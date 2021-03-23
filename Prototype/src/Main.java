import java.util.Scanner;

public class Main {
    public static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        while (true) {
            System.out.println();
            System.out.println("1. Update Products List");
            System.out.println("2. Create Build");
            System.out.println("3. Exit");

            System.out.println();
            System.out.print("Input: ");

            try {
                int choice = Integer.parseInt(scanner.nextLine());
                if (choice == 1) new Vendors();
                else if (choice == 2) System.out.println("2");
                else if (choice == 3) break;
                else throw new Exception();
            } catch (Exception e) {
                System.out.println("Invalid Input");
            }
        }
    }
}