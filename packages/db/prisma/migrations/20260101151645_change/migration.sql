/*
  Warnings:

  - Changed the type of `respone_time` on the `WebsiteTick` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "WebsiteTick" DROP COLUMN "respone_time",
ADD COLUMN     "respone_time" INTEGER NOT NULL;
