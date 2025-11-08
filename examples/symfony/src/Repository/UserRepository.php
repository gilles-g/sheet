<?php

namespace App\Repository;

use App\Entity\User;
use App\Storage\FileStorage;

class UserRepository
{
    private FileStorage $storage;

    public function __construct(FileStorage $storage)
    {
        $this->storage = $storage;
    }

    public function findAll(): array
    {
        $data = $this->storage->findAll('user');
        $users = [];
        foreach ($data as $item) {
            $user = new User();
            $user->setId($item['id']);
            $user->setName($item['name']);
            $user->setEmail($item['email']);
            $users[] = $user;
        }
        return $users;
    }

    public function find(int $id): ?User
    {
        $item = $this->storage->find('user', $id);
        if (!$item) {
            return null;
        }
        
        $user = new User();
        $user->setId($item['id']);
        $user->setName($item['name']);
        $user->setEmail($item['email']);
        return $user;
    }
}
