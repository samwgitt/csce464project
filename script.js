document.addEventListener("DOMContentLoaded", () => {

  let draggedTile = null;

  function countUsedLetters() {
    const counts = {};
    document.querySelectorAll('.blank').forEach(blank => {
      const val = blank.value.trim().toUpperCase();
      if (val.match(/^[A-Z]$/)) {
        counts[val] = (counts[val] || 0) + 1;
      }
    });
    return counts;
  }

  function removeLetterElsewhere(letter, currentBlank) {
    document.querySelectorAll('.blank').forEach(blank => {
      if (blank !== currentBlank && blank.value.trim().toUpperCase() === letter) {
        blank.value = '';
      }
    });
  }

  function updateTileBank() {
    const used = countUsedLetters();
    document.querySelectorAll('.piece').forEach(piece => {
      const letter = piece.textContent.trim().toUpperCase();
      if (used[letter]) {
        piece.classList.add('disabled');
        piece.setAttribute('draggable', false);
      } else {
        piece.classList.remove('disabled');
        piece.setAttribute('draggable', true);
      }
    });
  }

  function updateBlankDraggables() {
    document.querySelectorAll('.blank').forEach(blank => {
      if (blank.value.trim() !== '') {
        blank.setAttribute('draggable', true);
      } else {
        blank.removeAttribute('draggable');
      }
    });
  }

  document.querySelectorAll('.piece').forEach(piece => {
    piece.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', piece.textContent.trim());
      draggedTile = null;
    });
  });

  document.querySelectorAll('.letter').forEach(letter => {
    letter.setAttribute('draggable', false);
  });

  document.querySelectorAll('.blank').forEach(blank => {
    blank.addEventListener('input', () => {
      const letter = blank.value.replace(/[^A-Za-z]/g, '').toUpperCase();
      blank.value = letter;

      if (blank.classList.contains('correct')) {
        blank.classList.remove('correct');
      }

      if (letter) {
        removeLetterElsewhere(letter, blank); 
      }

      updateBlankDraggables();
      updateTileBank();
    });

    blank.addEventListener('dragstart', (e) => {
      if (blank.value.trim() === '') {
        e.preventDefault();
        return;
      }
      draggedTile = blank;
      e.dataTransfer.setData('text/plain', blank.value.trim());
    });

    blank.addEventListener('dragover', (e) => e.preventDefault());

    blank.addEventListener('drop', (e) => {
      e.preventDefault();
      const letter = e.dataTransfer.getData('text/plain').toUpperCase();

      if (!letter.match(/^[A-Z]$/)) return;

      if (blank !== draggedTile) {
        removeLetterElsewhere(letter, blank); 
        blank.value = letter;

        if (draggedTile && draggedTile.classList.contains('blank')) {
          draggedTile.value = '';
        }

        updateBlankDraggables();
        updateTileBank();
      }
      
      blank.classList.remove("correct");

      draggedTile = null;
    });
  });

  const tileBank = document.querySelector('.tile-bank');

  if (tileBank) {
    tileBank.addEventListener('dragover', (e) => {
      e.preventDefault(); 
    });

    tileBank.addEventListener('drop', (e) => {
      e.preventDefault();

      const letter = e.dataTransfer.getData('text/plain').toUpperCase();
      if (!letter.match(/^[A-Z]$/)) return;

      document.querySelectorAll('.blank').forEach(blank => {
        if (blank.value.trim().toUpperCase() === letter) {
          blank.value = '';
        }
      });

      updateBlankDraggables();
      updateTileBank();
    });
  }

  document.getElementById('checkButton').addEventListener('click', () => {
    let allCorrect = true;

    document.querySelectorAll('.blank').forEach(blank => {
      const expected = blank.getAttribute('data-correct')?.toUpperCase();
      const actual = blank.value.trim().toUpperCase();

      console.log(`Expected: ${expected}, User: ${actual}`);

      if (expected !== actual) {
        allCorrect = false;
      }
    });

    const result = document.getElementById('resultMessage');
    if (allCorrect) {
      result.textContent = 'Congratulations! You solved the puzzle!';
      result.style.color = 'green';
      document.querySelectorAll('.blank').forEach(blank => {
        blank.classList.add('correct');
      });
    } else {
      result.textContent = 'Some letters are incorrect. Keep trying!';
      result.style.color = 'red';
    }
  });

  document.getElementById("hintButton").addEventListener("click", function() {
    document.querySelectorAll(".blank").forEach(blank => {
      const correct = blank.getAttribute("data-correct");
      const value = blank.value.trim().toUpperCase();

      if (value === correct) {
        blank.classList.add("correct");
      }
    });
  });

  updateBlankDraggables();
  updateTileBank();

});