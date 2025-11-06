<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\UserType;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    #[Route('/users', name: 'user_list')]
    public function index(UserRepository $userRepository): Response
    {
        $users = $userRepository->findAll();
        
        return $this->render('user/index.html.twig', [
            'users' => $users,
        ]);
    }
    
    #[Route('/users/create-sheet', name: 'user_create_sheet')]
    public function createSheet(Request $request, EntityManagerInterface $em): Response
    {
        $user = new User();
        $form = $this->createForm(UserType::class, $user);
        
        $form->handleRequest($request);
        
        if ($form->isSubmitted() && $form->isValid()) {
            $em->persist($user);
            $em->flush();
            
            // Return a Turbo Stream response to close sheet and refresh list
            return $this->render('user/_success_stream.html.twig', [
                'user' => $user,
                'action' => 'created',
            ]);
        }
        
        return $this->render('user/_form_sheet.html.twig', [
            'form' => $form,
        ]);
    }
    
    #[Route('/users/{id}/edit-sheet', name: 'user_edit_sheet')]
    public function editSheet(User $user, Request $request, EntityManagerInterface $em): Response
    {
        $form = $this->createForm(UserType::class, $user);
        
        $form->handleRequest($request);
        
        if ($form->isSubmitted() && $form->isValid()) {
            $em->flush();
            
            return $this->render('user/_success_stream.html.twig', [
                'user' => $user,
                'action' => 'updated',
            ]);
        }
        
        return $this->render('user/_form_sheet.html.twig', [
            'form' => $form,
            'user' => $user,
        ]);
    }

    #[Route('/users/{id}/delete', name: 'user_delete', methods: ['POST'])]
    public function delete(User $user, Request $request, EntityManagerInterface $em): Response
    {
        // Validate CSRF token
        if ($this->isCsrfTokenValid('delete'.$user->getId(), $request->request->get('_token'))) {
            $em->remove($user);
            $em->flush();
        }
        
        return $this->redirectToRoute('user_list');
    }
}
