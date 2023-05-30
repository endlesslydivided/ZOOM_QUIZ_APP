import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveAnswerIsCorrect1685354501341 implements MigrationInterface {
    name = 'RemoveAnswerIsCorrect1685354501341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "isCorrect"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" ADD "isCorrect" boolean NOT NULL DEFAULT false`);
    }

}
