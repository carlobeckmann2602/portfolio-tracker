-- AlterTable
CREATE SEQUENCE "transactions_id_seq";
ALTER TABLE "Transactions" ALTER COLUMN "id" SET DEFAULT nextval('transactions_id_seq');
ALTER SEQUENCE "transactions_id_seq" OWNED BY "Transactions"."id";
