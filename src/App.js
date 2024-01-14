import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -70,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 200,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App(){
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [showSplitBill, setShowSplitBill] = useState(false);
  const [curFriend, setCurFriend] = useState(null);
  function handleShowAddFriend(){
    setShowAddFriend((show) => !show);
  }
  function handleAddFriend(friend){
    setFriends((friends) => [...friends,friend]);
  }
  function handleSelectFriend(friend){
    setCurFriend(friend);
    setShowSplitBill(true);
  }
  function handleBalance(bal){
    setFriends(() =>
      friends.map((friend) =>
      friend.id === curFriend.id ? {...friend, balance: friend.balance+bal}: friend
      )
    );
    setShowSplitBill(false);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList friends={friends} onSelectFriend={handleSelectFriend}/>
        { showAddFriend && <FormAddFriend  onAddFriend={handleAddFriend}/>}
        <Button onClick={handleShowAddFriend}>{showAddFriend ? "Close" : "Add Friend"}</Button>
      </div>
      { showSplitBill && <FormSplitBill curFriend={curFriend} onSplitBill={handleBalance} />}
    </div>
  );
}

function FriendsList({friends, onSelectFriend}){
  return (
    <ul>
      {friends.map(friend => (
      <Friend friend={friend} key={friend.id} onSelectFriend={onSelectFriend}/>
    ))}
    </ul>
  );
}

function Friend({friend, onSelectFriend}){
  function handleSelectFriend(e){
    e.preventDefault();
    onSelectFriend(friend);
  }
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && <p className="red">You owe {friend.name} {Math.abs(friend.balance)}₹ </p>}
      {friend.balance > 0 && <p className="green">{friend.name} owe You {Math.abs(friend.balance)}₹ </p>}
      {friend.balance === 0 && <p>You and {friend.name} are even </p>}
      <Button onClick={handleSelectFriend}>Select</Button>
    </li>
  );
}
function Button({children, onClick}){
  return <button className="button" onClick={onClick}>{children}</button>
}
function FormAddFriend({onAddFriend}){
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  

  function handleSubmit(e){
    e.preventDefault();

    if( !name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id : id,
      name : name,
      image : `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");

  }

  
  return (
    <form className="form-add-friend">
      <label>🧑‍🤝‍🧑Friend name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>

      <label>🌅Image URL</label>
      <input type="text" value={image} onChange={((e) => setImage(e.target.value))}/>

      <Button onClick={handleSubmit}>Add</Button>
    </form>
  )
}

function FormSplitBill({curFriend, onSplitBill}){
  const [bill, setBill] = useState(0);

  const [myExpense, setMyExpense] = useState(0);

  const othersExpense = bill >= myExpense ? bill - myExpense : 0;

  const [paidBy, setPaidBy] = useState("user");


  function handleSubmit(e){
    e.preventDefault();

    if(!bill || !paidBy) return;

    const netPay = paidBy === "user" ? othersExpense : -myExpense;
    console.log(netPay);
    console.log(othersExpense);
    console.log(myExpense);
    onSplitBill(netPay);
    setBill(0);
    setMyExpense(0);
  }
  return <form className="form-split-bill" onSubmit={handleSubmit}>
    <h2>Split a bill with {curFriend.name}</h2>

    <label>💰Bill Value</label>
      <input type="number" min={0} value={bill} onChange={(e) => setBill(Number(e.target.value))}/>

    <label>👤Your Expense</label>
      <input type="number" min={0} value={myExpense} onChange={(e) => setMyExpense(Number(e.target.value))}/>

    <label>🧑‍🤝‍🧑{curFriend.name}'s expense</label>
      <input type="number"  value={othersExpense} disabled />

    <label>🤑 Who is paying the bill</label>
      <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
        <option value="user">You</option>
        <option value={curFriend.name}>{curFriend.name}</option>
      </select>

      <Button>Split bill</Button>
  </form>
}