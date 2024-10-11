# Marble Rotation Game

A web-based implementation of a two-player marble rotation game, inspired by games like Pentago. Players take turns placing marbles on a 6x6 board and rotating sub-boards to create a line of five marbles in any direction.

## Features

- **Two-Player Gameplay**: Play against another player locally.
- **Rotating Sub-Boards**: After placing a marble, players can rotate a sub-board to change the game state.
- **Win Detection**: Automatically detects when a player has won.
- **Undo Functionality**: Undo the last move if needed.
- **Server-Side Logging**: Moves are logged on the server using a Flask backend.
- **Responsive Design**: The game adjusts to different screen sizes for optimal play on various devices.
- **Visual Enhancements**: Animations for marble placements and rotations, and visual feedback for invalid moves.

## Technologies Used

- **Front-End**: HTML, CSS, JavaScript
- **Back-End**: Python Flask
- **Additional Libraries**:
  - [Font Awesome](https://fontawesome.com/) for icons
  - [Flask-CORS](https://flask-cors.readthedocs.io/) for handling Cross-Origin Resource Sharing

## Installation

### Prerequisites

- **Python 3.6+**
- **pip** package manager
- **Virtual Environment** (optional but recommended)

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/marble-rotation-game.git
   cd marble-rotation-game
   ```

2. **Set Up a Virtual Environment (Optional)**

   ```bash
   python -m venv venv
   ```

3. **Activate the Virtual Environment**

   - On Windows:

     ```bash
     venv\Scripts\activate
     ```

   - On Unix or MacOS:

     ```bash
     source venv/bin/activate
     ```

4. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

5. **Run the Flask Application**

   ```bash
   python app.py
   ```

6. **Access the Game**

   Open your web browser and navigate to `http://localhost:5000`

## Usage

- **Placing Marbles**: Click on an empty cell to place your marble.
- **Rotating Sub-Boards**: After placing a marble, you can rotate a sub-board by clicking the rotation buttons.
- **Skipping Rotation**: If rotation is optional, you can skip it using the "Skip Rotation" button.
- **Undo Move**: Click the "Undo" button to revert the last move.
- **Restart Game**: Use the "Restart Game" button to reset the board but keep scores.
- **Restart Set**: Use the "Restart Set" button to reset the entire game and scores.

## Screenshots

*Note: Include screenshots of the game interface here if desired.*

## Development

### Front-End

- **HTML**: Structure of the game interface.
- **CSS**: Styling and animations.
- **JavaScript**: Game logic, event handling, and UI updates.

### Back-End

- **Flask Server (`app.py`)**: Serves the game files and handles move logging.
- **Logging**: Moves are logged to `game_logs.txt` with timestamps.

## Project Structure

```
marble-rotation-game/
│
├── app.py
├── index.html
├── styles.css
├── requirements.txt
├── game_logs.txt
├── README.md
└── js/
    ├── logic.js
    ├── utils.js
    └── animations.js
```

## Dependencies

Listed in `requirements.txt`:

```
Flask
flask-cors
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Font Awesome** for providing iconography.
- **Flask** and **Flask-CORS** for the web framework and CORS handling.

## Contact

For any inquiries or suggestions, please contact [konstantinosevang@gmail.com](mailto:konstantinosevang@gmail.com).

