/*
  Warnings:

  - Added the required column `slug` to the `Categorias` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- First, add slug with a temporary default
CREATE TABLE "new_Categorias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL DEFAULT 'temp-slug',
    "cor" TEXT NOT NULL DEFAULT '#000000'
);

-- Copy data from old table
INSERT INTO "new_Categorias" ("id", "nome") SELECT "id", "nome" FROM "Categorias";

-- Update slug based on nome (convert to lowercase and replace spaces with hyphens)
UPDATE "new_Categorias" SET "slug" = lower(replace(replace(replace(replace(replace(nome, ' ', '-'), 'ã', 'a'), 'á', 'a'), 'é', 'e'), 'ó', 'o'));

-- Drop old table and rename new one
DROP TABLE "Categorias";
ALTER TABLE "new_Categorias" RENAME TO "Categorias";

-- Create unique index on slug
CREATE UNIQUE INDEX "Categorias_slug_key" ON "Categorias"("slug");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
