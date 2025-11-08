<?php

namespace App\Command;

use App\Storage\FileStorage;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:init-data',
    description: 'Initialize test data in file storage',
)]
class InitDataCommand extends Command
{
    public function __construct(private FileStorage $storage)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $this->storage->initializeTestData();

        $io->success('Test data initialized successfully!');

        return Command::SUCCESS;
    }
}
