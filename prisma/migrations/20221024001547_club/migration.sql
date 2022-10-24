-- DropForeignKey
ALTER TABLE `player` DROP FOREIGN KEY `Player_clubList_fkey`;

-- AlterTable
ALTER TABLE `player` MODIFY `clubList` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Player` ADD CONSTRAINT `Player_clubList_fkey` FOREIGN KEY (`clubList`) REFERENCES `Club`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
