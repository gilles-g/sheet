<?php

namespace App\Form;

use App\Entity\Ingredient;
use App\Entity\RecipeIngredient;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints as Assert;

class RecipeIngredientType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('ingredient', EntityType::class, [
                'class' => Ingredient::class,
                'choice_label' => 'name',
                'label' => 'Ingredient',
                'attr' => ['class' => 'form-control'],
                'placeholder' => 'Select an ingredient',
                'constraints' => [
                    new Assert\NotBlank(),
                ],
            ])
            ->add('quantity', TextType::class, [
                'label' => 'Quantity',
                'attr' => ['class' => 'form-control', 'placeholder' => 'e.g., 2 cups, 100g, 3 pieces'],
                'constraints' => [
                    new Assert\NotBlank(),
                    new Assert\Length(['min' => 1, 'max' => 100]),
                ],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => RecipeIngredient::class,
        ]);
    }
}
