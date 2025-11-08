<?php

namespace App\Storage;

class FileStorage
{
    private string $dataDir;

    public function __construct(string $projectDir)
    {
        $this->dataDir = $projectDir . '/var/data';
        if (!is_dir($this->dataDir)) {
            mkdir($this->dataDir, 0777, true);
        }
    }

    public function getDataFile(string $entity): string
    {
        return $this->dataDir . '/' . strtolower($entity) . '.php';
    }

    public function read(string $entity): array
    {
        $file = $this->getDataFile($entity);
        if (!file_exists($file)) {
            return [];
        }
        return include $file;
    }

    public function write(string $entity, array $data): void
    {
        $file = $this->getDataFile($entity);
        $export = var_export($data, true);
        file_put_contents($file, "<?php\n\nreturn " . $export . ";\n");
    }

    public function findAll(string $entity): array
    {
        return $this->read($entity);
    }

    public function find(string $entity, int $id): ?array
    {
        $data = $this->read($entity);
        return $data[$id] ?? null;
    }

    public function save(string $entity, array $item): int
    {
        $data = $this->read($entity);
        
        if (isset($item['id']) && isset($data[$item['id']])) {
            // Update existing
            $data[$item['id']] = $item;
            $id = $item['id'];
        } else {
            // Create new
            $id = empty($data) ? 1 : max(array_keys($data)) + 1;
            $item['id'] = $id;
            $data[$id] = $item;
        }
        
        $this->write($entity, $data);
        return $id;
    }

    public function delete(string $entity, int $id): void
    {
        $data = $this->read($entity);
        unset($data[$id]);
        $this->write($entity, $data);
    }

    public function clear(string $entity): void
    {
        $this->write($entity, []);
    }

    public function initializeTestData(): void
    {
        // Initialize with some test users
        $users = [
            1 => ['id' => 1, 'name' => 'John Doe', 'email' => 'john@example.com'],
            2 => ['id' => 2, 'name' => 'Jane Smith', 'email' => 'jane@example.com'],
            3 => ['id' => 3, 'name' => 'Bob Johnson', 'email' => 'bob@example.com'],
        ];
        $this->write('user', $users);

        // Initialize empty recipes and ingredients
        $this->write('recipe', []);
        $this->write('ingredient', []);
        $this->write('recipeingredient', []);
    }
}
