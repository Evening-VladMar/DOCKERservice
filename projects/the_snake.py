from random import randrange

import pygame

# Константы для размеров поля и сетки:
SCREEN_WIDTH, SCREEN_HEIGHT = 640, 480
GRID_SIZE = 20
GRID_WIDTH = SCREEN_WIDTH // GRID_SIZE
GRID_HEIGHT = SCREEN_HEIGHT // GRID_SIZE

# Направления движения:
UP = (0, -1)
DOWN = (0, 1)
LEFT = (-1, 0)
RIGHT = (1, 0)

# Цвет фона - черный:
BOARD_BACKGROUND_COLOR = (106, 79, 60)

# Цвет границы ячейки
BORDER_COLOR = (90, 212, 228)

# Цвет яблока
APPLE_COLOR = (255, 99, 71)

# Цвет змейки
SNAKE_COLOR = [(34, 139, 34), (11, 102, 37)]

# Цвет камня
STONE_COLOR = (122, 122, 122)

# Скорость движения змейки:
SPEED = 15

# Настройка игрового окна:
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT), 0, 32)

# Заголовок окна игрового поля:
pygame.display.set_caption('Змейка')

# Настройка времени:
clock = pygame.time.Clock()


class GameObject:
    """
    Класс GameObject - Базовый класс для инициализации атрибутов объектов.
    Генерирует случайные координаты объектам.
    """

    def __init__(self, color=None, position=None):
        self.body_color = color
        self.position = position

    def draw(self, part_color=None):
        """Отрисовывает объект на поле."""
        color = part_color if part_color is not None else self.body_color
        rect = pygame.Rect(self.position, (GRID_SIZE, GRID_SIZE))
        pygame.draw.rect(screen, color, rect)
        pygame.draw.rect(screen, BORDER_COLOR, rect, 1)

    # Метод randomize_position задает координаты объектам-наследникам
    @staticmethod
    def randomize_position():
        """Возвращает случайные координаты яблока на поле."""
        x = randrange(0, SCREEN_WIDTH, 20)
        y = randrange(0, SCREEN_HEIGHT, 20)
        return x, y


class Apple(GameObject):
    """Класс для описания яблока в игре. Наследует от GameObject"""

    def __init__(self, color=APPLE_COLOR):
        super().__init__(color, self.randomize_position())


class Snake(GameObject):
    """Класс змеи в игре. Наследует от GameObject"""

    def __init__(self, color=SNAKE_COLOR):
        super().__init__(color)
        self.body_color, self.head_color = color
        self.positions = [(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2)]
        self.direction = RIGHT
        self.next_direction = None
        self.last = None
        self.ate = False

    # Метод обновления направления после нажатия на кнопку
    def update_direction(self):
        """Обновляет направление движения змеи"""
        if self.next_direction:
            self.direction = self.next_direction
            self.next_direction = None

    def move(self):
        """
        Перемещает змею в выбранном направлении. Увеличивает длину на единицу
        и удаляет последний сегмент, если длина змеи не увеличена.
        """
        x, y = self.get_head_position
        dx, dy = self.direction
        new_x = (x + dx * GRID_SIZE) % SCREEN_WIDTH
        new_y = (y + dy * GRID_SIZE) % SCREEN_HEIGHT
        self.positions.insert(0, (new_x, new_y))
        self.last = self.positions.pop() if not self.ate else self.last
        self.ate = False

    @property
    def get_head_position(self):
        """Возвращает координаты головы змеи."""
        return self.positions[0]

    def reset(self):
        """Сбрасывает координаты змеи до начального значения."""
        screen.fill(BOARD_BACKGROUND_COLOR)
        self.positions = [(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2)]

    def draw(self):
        """
        Отрисовывает змею на экране, затирая последний сегмент, если змея
        переместилась.
        """
        for position in self.positions:
            rect = (pygame.Rect(position, (GRID_SIZE, GRID_SIZE)))
            pygame.draw.rect(screen, self.body_color, rect)
            pygame.draw.rect(screen, self.body_color, rect, 1)

        # Отрисовка головы змейки
        self.position = self.get_head_position
        super().draw(self.head_color)

        # Затирание последнего сегмента
        if self.last:
            last_rect = pygame.Rect(self.last, (GRID_SIZE, GRID_SIZE))
            pygame.draw.rect(screen, BOARD_BACKGROUND_COLOR, last_rect)


class Stone(GameObject):
    """Класс для описания камня в игре. Наследует от GameObject"""

    def __init__(self, color=STONE_COLOR):
        super().__init__(color, self.randomize_position())

    @staticmethod
    def reduction(list):
        """Уменьшает размер змеи на одну ячейку."""
        screen.fill(BOARD_BACKGROUND_COLOR)
        list.pop() if len(list) > 1 else list


def handle_keys(game_object):
    """
    Обрабатывает нажатия клавиш, чтобы изменить направление движения
    змеи.
    """
    rules_turns = {
        (pygame.K_UP, RIGHT): UP,
        (pygame.K_UP, LEFT): UP,
        (pygame.K_DOWN, RIGHT): DOWN,
        (pygame.K_DOWN, LEFT): DOWN,
        (pygame.K_LEFT, UP): LEFT,
        (pygame.K_LEFT, DOWN): LEFT,
        (pygame.K_RIGHT, UP): RIGHT,
        (pygame.K_RIGHT, DOWN): RIGHT,
    }

    # event.type - тип события (в данном случае интересен pygame.KEYDOWN)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            raise SystemExit
        elif event.type == pygame.KEYDOWN:
            if (event.key, game_object.direction) in rules_turns:
                game_object.next_direction = rules_turns[
                    (event.key, game_object.direction)
                ]


def main():
    """
    Основная функция запуска игры. Создает объекты яблока и змеи и управляет
    основным циклом игры.
    """
    pygame.init()
    apple = Apple(APPLE_COLOR)
    snake = Snake(SNAKE_COLOR)
    stone = Stone(STONE_COLOR)
    screen.fill(BOARD_BACKGROUND_COLOR)

    while True:
        clock.tick(SPEED)

        stone.draw()
        apple.draw()
        snake.move()
        snake.draw()
        handle_keys(snake)
        snake.update_direction()
        pygame.display.update()

        if snake.get_head_position == apple.position:
            snake.ate = True
            apple.position = apple.randomize_position()
            while apple.position in snake.positions:
                apple.position = apple.randomize_position()
        elif snake.get_head_position in snake.positions[1:]:
            snake.reset()
        elif snake.get_head_position == stone.position:
            stone.reduction(snake.positions)
            stone.position = stone.randomize_position()
            while stone.position in snake.positions:
                stone.position = stone.randomize_position()


if __name__ == '__main__':
    main()
