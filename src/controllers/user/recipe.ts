import { Router, Request, Response } from 'express';
import { tokenExtractor } from '~/middlewares/auth';
import { findRecipeById, findRecipes, deleteRecipe, createRecipe, updateRecipe } from '~/services/user/recipe';
import { recipeValidation } from '~/validations/recipe';
import httpStatus from 'http-status';

const recipeRouter = Router();
recipeRouter.use(tokenExtractor('USER'));

recipeRouter.get('/', recipeValidation.query, async (req: Request, res: Response) => {
  const query = req.query;
  const args = {
    where: {},
    skip: query.page ? (Number(query.page) - 1) * Number(query.limit) : 10,
    take: query.limit ? Number(query.limit) : 0,
  };

  if (query.search) {
    args.where = {
      OR: [
        {
          name: {
            contains: query.search as string,
          },
        },
        {
          description: {
            contains: query.search as string,
          },
        },
      ],
    };
  }

  if (query.userId) {
    args.where = {
      ...args.where,
      user: {
        id: Number(query.userId),
      },
    };
  }

  if (query.foodNames) {
    args.where = {
      ...args.where,
      foods: {
        some: {
          name: {
            in: query.foodNames as string[],
          },
        },
      },
    };
  }

  res.status(httpStatus.OK).json(await findRecipes(args));
});

recipeRouter.get('/:id', async (req: Request, res: Response) => {
  res.status(httpStatus.OK).json(await findRecipeById(Number(req.params.id)));
});

recipeRouter.post('/', recipeValidation.create, async (req: Request, res: Response) => {
  console.log(req.body);
  res.status(httpStatus.CREATED).json(await createRecipe(req.body, Number(req.user.id)));
});

recipeRouter.patch('/:id', async (req: Request, res: Response) => {
  const userId = Number(req.user.id);
  const recipeId = Number(req.params.id);
  res.status(httpStatus.OK).json(await updateRecipe(recipeId, userId, req.body));
});

recipeRouter.delete('/:id', async (req: Request, res: Response) => {
  const userId = Number(req.user.id);
  const recipeId = Number(req.params.id);
  await deleteRecipe(recipeId, userId);
  res.status(httpStatus.NO_CONTENT).json();
});

export default recipeRouter;
