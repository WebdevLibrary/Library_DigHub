-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "company" TEXT,
    "wish" TEXT
);

-- CreateTable
CREATE TABLE "Book" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "publisher" TEXT,
    "free" BOOLEAN,
    "QRcode" TEXT,
    "ISBN" TEXT
);

-- CreateTable
CREATE TABLE "_BookToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BookToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BookToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Book_QRcode_key" ON "Book"("QRcode");

-- CreateIndex
CREATE UNIQUE INDEX "Book_ISBN_key" ON "Book"("ISBN");

-- CreateIndex
CREATE UNIQUE INDEX "_BookToUser_AB_unique" ON "_BookToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_BookToUser_B_index" ON "_BookToUser"("B");
