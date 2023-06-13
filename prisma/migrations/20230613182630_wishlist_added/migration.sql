/*
  Warnings:

  - You are about to drop the column `free` on the `Book` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Wishlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "publisher" TEXT,
    "QRcode" TEXT,
    "ISBN" TEXT
);

-- CreateTable
CREATE TABLE "_UserToWishlist" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UserToWishlist_A_fkey" FOREIGN KEY ("A") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserToWishlist_B_fkey" FOREIGN KEY ("B") REFERENCES "Wishlist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "publisher" TEXT,
    "isFree" BOOLEAN,
    "QRcode" TEXT,
    "ISBN" TEXT
);
INSERT INTO "new_Book" ("ISBN", "QRcode", "author", "id", "publisher", "title") SELECT "ISBN", "QRcode", "author", "id", "publisher", "title" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE UNIQUE INDEX "Book_QRcode_key" ON "Book"("QRcode");
CREATE UNIQUE INDEX "Book_ISBN_key" ON "Book"("ISBN");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_QRcode_key" ON "Wishlist"("QRcode");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_ISBN_key" ON "Wishlist"("ISBN");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToWishlist_AB_unique" ON "_UserToWishlist"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToWishlist_B_index" ON "_UserToWishlist"("B");
