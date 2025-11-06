<?php

namespace App\Controller;

use App\Entity\Ingredient;
use App\Form\IngredientType;
use App\Repository\IngredientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class IngredientController extends AbstractController
{
    #[Route('/ingredients', name: 'ingredient_list')]
    public function index(IngredientRepository $ingredientRepository): Response
    {
        $ingredients = $ingredientRepository->findAll();
        
        return $this->render('ingredient/index.html.twig', [
            'ingredients' => $ingredients,
        ]);
    }
    
    #[Route('/ingredients/create-sheet', name: 'ingredient_create_sheet')]
    public function createSheet(Request $request, EntityManagerInterface $em): Response
    {
        $ingredient = new Ingredient();
        $form = $this->createForm(IngredientType::class, $ingredient);
        
        $form->handleRequest($request);
        
        if ($form->isSubmitted() && $form->isValid()) {
            $em->persist($ingredient);
            $em->flush();
            
            // Return a Turbo Stream response to close sheet and refresh
            return $this->render('ingredient/_success_stream.html.twig', [
                'ingredient' => $ingredient,
                'action' => 'created',
            ]);
        }
        
        return $this->render('ingredient/_form_sheet.html.twig', [
            'form' => $form,
        ]);
    }
    
    #[Route('/ingredients/{id}/edit-sheet', name: 'ingredient_edit_sheet')]
    public function editSheet(Ingredient $ingredient, Request $request, EntityManagerInterface $em): Response
    {
        $form = $this->createForm(IngredientType::class, $ingredient);
        
        $form->handleRequest($request);
        
        if ($form->isSubmitted() && $form->isValid()) {
            $em->flush();
            
            return $this->render('ingredient/_success_stream.html.twig', [
                'ingredient' => $ingredient,
                'action' => 'updated',
            ]);
        }
        
        return $this->render('ingredient/_form_sheet.html.twig', [
            'form' => $form,
            'ingredient' => $ingredient,
        ]);
    }

    #[Route('/ingredients/{id}/delete', name: 'ingredient_delete', methods: ['POST'])]
    public function delete(Ingredient $ingredient, Request $request, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('delete'.$ingredient->getId(), $request->request->get('_token'))) {
            $em->remove($ingredient);
            $em->flush();
        }
        
        return $this->redirectToRoute('ingredient_list');
    }
}
