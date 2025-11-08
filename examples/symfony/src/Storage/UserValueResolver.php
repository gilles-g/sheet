<?php

namespace App\Storage;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Controller\ValueResolverInterface;
use Symfony\Component\HttpKernel\ControllerMetadata\ArgumentMetadata;

class UserValueResolver implements ValueResolverInterface
{
    public function __construct(private UserRepository $userRepository)
    {
    }

    public function resolve(Request $request, ArgumentMetadata $argument): iterable
    {
        // Check if this is a User argument
        if ($argument->getType() !== User::class) {
            return [];
        }

        // Get the {id} from route
        $id = $request->attributes->get('id');
        if (!$id) {
            return [];
        }

        $user = $this->userRepository->find((int) $id);
        if (!$user) {
            return [];
        }

        yield $user;
    }
}
