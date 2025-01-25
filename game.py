def show_room(currentRoom):      #function created to show user what room they are currently in
print(f'You are currently in the',currentRoom,)

name = input('Please enter your name: ')  #Ask the user to input their name
def show_instructions():     #function created to welcome user to game and give rules of the game
print(f'Hello',name)
print(f'Welcome to Defeating Franco the Food Monster!\n')
print('To win the game, collect 6 food items or Franco will find the new food shipment and get away. Avoid Franco at all costs\n')
print('Move Commands: go North, go South, go East, go West\n')
print('If you wish to leave the game early, type "exit"')

show_instructions()

def show_moves(currentroom):  #function created to show user what room they are in and what item is located in that room
print(currentroom)
print(current_inventory)
print(rooms[currentroom].keys())
print(rooms[currentroom]['item'])

def count_items(current_inventory):  #function created to count numbers in the user's inventory until they find all 6
count = 0
for item in current_inventory:
count += 1
if count == 6:
break
return count
current_inventory = []        #Create inventory list to keep track of the inventory of collected items by game player
num_items = count_items(current_inventory)

rooms = {                     #Create dictionary for rooms of game and corresponding directions and items
'Lobby': {'East': 'Director office', 'South': 'Daycare'},
'Director office': {'South': 'Lounge', 'item': 'Chocolate'},
'Daycare': {'South': 'Deep Freezer', 'item': 'Cracker'},
'Deep Freezer': {'North': 'Daycare', 'South': 'Greenhouse', 'East': 'Storage Room', 'item': 'Steak'},
'Greenhouse': {'North': 'Deep Freezer', 'East': 'Garage', 'item': 'Tomato'},
'Garage': {'North': 'Storage Room', 'item': 'Franco'},
'Lounge': {'North': 'Director office', 'South': 'Storage Room', 'item': 'Water'},
'Storage Room': {'North': 'Lounge', 'South': 'Garage','West': 'Deep Freezer', 'item': 'Potato'}
}

currentRoom = 'Lobby'           #variable to show the user where they are starting the game
game_loss = bool(False)         #create variable that determines whether the game continues or ends

while game_loss == bool(False):  #While loop which will continue until user types "exit" or collects all items in game or encounters Franco
show_room(currentRoom)       #Shows user what room they are in
print(current_inventory)     #Shows user their current items in inventory
user_move = input('Please choose a move or get an item: ')
command = user_move.split()

if user_move == 'exit':
print('See you later, goodbye!')
break                   #Exits the loop and ends the game if the user types "exit"

if command[0] == 'go':      #if statement to check for valid move input from the user to move within the game
if command[1] in rooms[currentRoom].keys():    #if statement to check for a valid direction for user to go
currentRoom = rooms[currentRoom][command[1]]  #variable that updates with room user moves to
if currentRoom == 'Garage':            #if statement that ends the game if the user goes to the garage, where Franco is
print('Franco is in there! Sorry, you lost!')
break
print(f'The item in this room is', rooms[currentRoom]['item'])

else:
print(f'You cant go that direction from', {currentRoom})  #else statement that controls whether the user asks to go in a valid direction
if command[0] == 'get':     #if statement controlling valid input from item to begin to retrieve an item
if command[1] == rooms[currentRoom]['item']:  #if statement that will retrieve an item in a room if located in dictionary
current_inventory.append(rooms[currentRoom]['item'])  #adds the new item retrieved to the current inventory list for the user
print('You got the item!')
if len(current_inventory) > 5:   #if statement that counts how many items the user finds, ends game once user retrieves 6
print(f'You found all 6 items. Congratulations',name,'! You defeated Franco and won the game! :) ')
break

elif user_move != command:  #input validation to protect against a user entering invalid input
print('That is invalid')

else:       #prompts the user that a command is invalid if not one of the given directions
print('Invalid Command')