import { Router, Request, Response } from 'express';
import { tokenExtractor } from '~/middlewares/auth';
import { findRecipesById, findRecipes, deleteRecipe, createRecipe, updateRecipe } from '~/services/user/recipe';
import { recipeValidation } from '~/validations/recipe';
import httpStatus from 'http-status';

const recipeRouter = Router();
recipeRouter.use(tokenExtractor('USER'));

recipeRouter.get('/', recipeValidation.query, async (req: Request, res: Response) => {
  const query = req.query;
  const agrs = {
    where: {},
    take: query.take ? Number(query.take) : 10,
    skip: query.skip ? Number(query.skip) : 0,
  };

  if (query.search) {
    agrs.where = {
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
    agrs.where = {
      ...agrs.where,
      user: {
        id: Number(query.userId),
      },
    };
  }

  if (query.foodNames) {
    agrs.where = {
      ...agrs.where,
      foods: {
        some: {
          name: {
            in: query.foodNames as string[],
          },
        },
      },
    };
  }

  res.status(httpStatus.OK).json(await findRecipes(agrs));
});

recipeRouter.get('/:id', async (req: Request, res: Response) => {
  res.status(httpStatus.OK).json(await findRecipesById(Number(req.params.id)));
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
