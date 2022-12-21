-- AlterTable
CREATE SEQUENCE "stockhistory_id_seq";
ALTER TABLE "StockHistory" ALTER COLUMN "id" SET DEFAULT nextval('stockhistory_id_seq');
ALTER SEQUENCE "stockhistory_id_seq" OWNED BY "StockHistory"."id";
