<?php

namespace App\Controller;

use App\Entity\Recipe;
use App\Entity\RecipeIngredient;
use App\Form\RecipeIngredientType;
use App\Form\RecipeType;
use App\Repository\RecipeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class RecipeController extends AbstractController
{
    #[Route('/recipes', name: 'recipe_list')]
    public function index(RecipeRepository $recipeRepository): Response
    {
        $recipes = $recipeRepository->findAll();
        
        return $this->render('recipe/index.html.twig', [
            'recipes' => $recipes,
        ]);
    }
    
    #[Route('/recipes/create-sheet', name: 'recipe_create_sheet')]
    public function createSheet(Request $request, EntityManagerInterface $em): Response
    {
        $recipe = new Recipe();
        $form = $this->createForm(RecipeType::class, $recipe);
        
        $form->handleRequest($request);
        
        if ($form->isSubmitted() && $form->isValid()) {
            $em->persist($recipe);
            $em->flush();
            
            return $this->render('recipe/_success_stream.html.twig', [
                'recipe' => $recipe,
                'action' => 'created',
            ]);
        }
        
        return $this->render('recipe/_form_sheet.html.twig', [
            'form' => $form,
        ]);
    }
    
    #[Route('/recipes/{id}', name: 'recipe_detail')]
    public function detail(Recipe $recipe): Response
    {
        return $this->render('recipe/detail.html.twig', [
            'recipe' => $recipe,
        ]);
    }
    
    #[Route('/recipes/{id}/ingredients/add-sheet', name: 'recipe_ingredient_add_sheet')]
    public function addIngredientSheet(Recipe $recipe, Request $request, EntityManagerInterface $em): Response
    {
        $recipeIngredient = new RecipeIngredient();
        $recipeIngredient->setRecipe($recipe);
        
        $form = $this->createForm(RecipeIngredientType::class, $recipeIngredient);
        
        $form->handleRequest($request);
        
        if ($form->isSubmitted() && $form->isValid()) {
            $recipe->addRecipeIngredient($recipeIngredient);
            $em->persist($recipeIngredient);
            $em->flush();
            
            return $this->render('recipe/_ingredient_success_stream.html.twig', [
                'recipe' => $recipe,
                'recipeIngredient' => $recipeIngredient,
            ]);
        }
        
        return $this->render('recipe/_ingredient_form_sheet.html.twig', [
            'form' => $form,
            'recipe' => $recipe,
        ]);
    }
    
    #[Route('/recipes/{id}/ingredients/{ingredientId}/delete', name: 'recipe_ingredient_delete', methods: ['POST'])]
    public function deleteIngredient(
        Recipe $recipe,
        int $ingredientId,
        Request $request,
        EntityManagerInterface $em
    ): Response {
        $recipeIngredient = $recipe->getRecipeIngredients()->filter(
            fn($ri) => $ri->getId() === $ingredientId
        )->first();
        
        if ($recipeIngredient && $this->isCsrfTokenValid('delete'.$ingredientId, $request->request->get('_token'))) {
            $recipe->removeRecipeIngredient($recipeIngredient);
            $em->remove($recipeIngredient);
            $em->flush();
        }
        
        return $this->redirectToRoute('recipe_detail', ['id' => $recipe->getId()]);
    }

    #[Route('/recipes/{id}/delete', name: 'recipe_delete', methods: ['POST'])]
    public function delete(Recipe $recipe, Request $request, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('delete'.$recipe->getId(), $request->request->get('_token'))) {
            $em->remove($recipe);
            $em->flush();
        }
        
        return $this->redirectToRoute('recipe_list');
    }
}
