-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Categorias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "cor" TEXT NOT NULL DEFAULT '#000000'
);
INSERT INTO "new_Categorias" ("cor", "id", "nome", "slug") SELECT "cor", "id", "nome", "slug" FROM "Categorias";
DROP TABLE "Categorias";
ALTER TABLE "new_Categorias" RENAME TO "Categorias";
CREATE UNIQUE INDEX "Categorias_slug_key" ON "Categorias"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
