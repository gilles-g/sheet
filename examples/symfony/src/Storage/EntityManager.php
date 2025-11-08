<?php

namespace App\Storage;

use App\Entity\User;

class EntityManager
{
    private FileStorage $storage;

    public function __construct(FileStorage $storage)
    {
        $this->storage = $storage;
    }

    public function persist(object $entity): void
    {
        // Store entity for later flush
        if (!$entity instanceof User) {
            return;
        }
        
        $data = [
            'name' => $entity->getName(),
            'email' => $entity->getEmail(),
        ];
        
        if ($entity->getId()) {
            $data['id'] = $entity->getId();
        }
        
        // Save immediately for simplicity
        $id = $this->storage->save('user', $data);
        $entity->setId($id);
    }

    public function remove(object $entity): void
    {
        if ($entity instanceof User && $entity->getId()) {
            $this->storage->delete('user', $entity->getId());
        }
    }

    public function flush(): void
    {
        // No-op for file storage (we persist immediately)
    }
}
