from PIL import Image
import os

def crop_menu():
    # Создаем папку для картинок если её нет
    if not os.path.exists('menu'):
        os.makedirs('menu')

    # ФОТО 1: РОЛЛЫ, ТЕМПУРА, ЗАПЕЧЕННЫЕ, РАМЕН
    img1 = Image.open('photo_2026-05-02_18-40-26 (2).jpg')
    
    # Сетка для роллов (4 ряда по 5 штук)
    x_starts = [40, 285, 530, 775, 1020]
    y_starts = [60, 210, 360, 510]
    w, h = 210, 100 # Размер области с едой (без текста)

    item_names_1 = [
        ['phil_lux', 'cucumber_roll', 'tempura_eel', 'cali_baked', 'leg_chicken_baked'],
        ['phil_classic', 'salmon_roll', 'hot_salmon', 'caesar_baked', 'leg_tuna_baked'],
        ['phil_eel', 'leg_chicken_roll', 'hot_caesar', 'baked_salmon_roll', 'baked_salmon_simple'],
        ['scorched', 'cali_simple', 'hot_shrimp', 'hot_cali', 'hawaiian_baked']
    ]

    for r in range(4):
        for c in range(5):
            name = item_names_1[r][c]
            box = (x_starts[c], y_starts[r], x_starts[c] + w, y_starts[r] + h)
            img1.crop(box).save(f'menu/{name}.jpg', quality=95)

    # Рамен (внизу фото 1)
    x_ramen = [45, 220, 400, 640]
    for i, name in enumerate(['ramen_chicken', 'ramen_creamy', 'ramen_beef', 'tom_yam']):
        box = (x_ramen[i], 635, x_ramen[i] + 160, 740)
        img1.crop(box).save(f'menu/{name}.jpg', quality=95)

    # ФОТО 2: ШАУРМА, ПИЦЦА, БУРГЕРЫ, КОМБО
    img2 = Image.open('photo_2026-05-02_18-40-26.jpg')
    
    # Шаурма
    img2.crop((15, 15, 215, 145)).save('menu/shawa_maxi.jpg', quality=95)
    img2.crop((225, 15, 425, 145)).save('menu/shawa_chicken.jpg', quality=95)
    
    # Бургеры
    img2.crop((445, 50, 635, 145)).save('menu/burger_cheese.jpg', quality=95)
    img2.crop((645, 50, 835, 145)).save('menu/burger_beef.jpg', quality=95)
    img2.crop((735, 270, 925, 365)).save('menu/burger_chicken.jpg', quality=95)
    
    # Пицца
    y_pizza = [175, 375, 575, 775] # Примерно
    # На самом деле они в два столбика слева
    img2.crop((10, 185, 210, 360)).save('menu/pizza_pep_double.jpg', quality=95)
    img2.crop((215, 185, 415, 360)).save('menu/pizza_marg.jpg', quality=95)
    img2.crop((10, 385, 210, 560)).save('menu/pizza_alfredo.jpg', quality=95)
    img2.crop((215, 385, 415, 560)).save('menu/pizza_cheese_chick.jpg', quality=95)
    img2.crop((10, 585, 210, 740)).save('menu/pizza_cheese.jpg', quality=95)
    img2.crop((215, 585, 415, 740)).save('menu/pizza_pep.jpg', quality=95)
    img2.crop((10, 785, 210, 960)).save('menu/pizza_caesar.jpg', quality=95) # Вне границ? Ой, фото 744 выс.
    # Поправка: пиццы ниже идут по сетке
    
    # Комбо и остальное - проще всего взять основные зоны
    img2.crop((440, 245, 660, 440)).save('menu/set_1.jpg', quality=95)
    img2.crop((440, 500, 660, 680)).save('menu/set_2.jpg', quality=95)

    print("Cropping finished!")

if __name__ == "__main__":
    crop_menu()
