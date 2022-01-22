import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPizzas } from '../redux/actions/pizzas';
import { Categories, SortPopup, PizzaBlock, PizzaLoadingBlock } from '../components';
import { setCategory, setSortBy } from '../redux/actions/filters';
import { addPizzaToCart } from '../redux/actions/cart';

const categoryNames = ['Мясные', 'Вегетарианская', 'Гриль', 'Острые', 'Закрытые'];

const sortItems = [
  { name: 'популярности', type: 'rating', order: 'desc' },
  { name: 'цене', type: 'price', order: 'desc' },
  { name: 'алфавиту', type: 'name', order: 'asc' },
];

export default function Home() {
 
  const items = useSelector(({ pizzas }) => pizzas.items); 
  const cartItems = useSelector(({ cart }) => cart.items);
  const isLoaded = useSelector(({ pizzas }) => pizzas.isLoaded);

  const { category, sortBy } = useSelector(({ filters }) => filters);

  const dispatch = useDispatch();

  React.useEffect(() => {
    console.log("kek")
    dispatch(fetchPizzas(sortBy, category)); 
  }, [category, sortBy]); //

  const onSelectCategory = React.useCallback((index) => {
    dispatch(setCategory(index));
  }, []);

  const onSelectSortType = React.useCallback((type) => {
    dispatch(setSortBy(type));
  }, []);

  const handleAddPizzaToCart = (
    obj,
  ) => {
    dispatch(addPizzaToCart(obj));
  };

  return (
    <div className="container">
      <div className="content__top">
        <Categories
          activeCategory={category}
          onClickCategory={onSelectCategory}
          items={categoryNames}
        />
        <SortPopup
          onClickSortType={onSelectSortType}
          activeSortType={sortBy.type}
          items={sortItems}
        />
      </div>
      <h2 className="content__title">Все пиццы</h2>

      <div className="content__items">
        {
          isLoaded
            ? items.map((obj) => (
                <PizzaBlock
                  onClickAddPizza={handleAddPizzaToCart}
                  key={obj.id}
                  {...obj}
                  addedCount={cartItems[obj.id] && cartItems[obj.id].items.length}
                />
              ))
            : Array(12)
                .fill(0)
                .map((_, index) => <PizzaLoadingBlock key={index} />)
        }
      </div>
    </div>
  );
}
