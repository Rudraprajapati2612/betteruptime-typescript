/*
  Warnings:

  - You are about to drop the column `respone_time` on the `WebsiteTick` table. All the data in the column will be lost.
  - Added the required column `response_time` to the `WebsiteTick` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WebsiteTick" DROP COLUMN "respone_time",
ADD COLUMN     "response_time" INTEGER NOT NULL;
