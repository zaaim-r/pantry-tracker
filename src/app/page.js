'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, Divider } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
import { ST } from 'next/dist/shared/lib/utils'
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
//import TextField from "@mui/material/TextField";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

const data = ['tomato', 'onion', 'biscoff', 'potato', 'carrot']

const SearchBar = ({setSearchQuery}) => (
  <form>
    <TextField
      id="search-bar"
      className="text"
      onInput={(e) => {
        setSearchQuery(e.target.value);
      }}
      label="Enter an item name"
      variant="outlined"
      placeholder="Search..."
      size="small"
      fullWidth
    />
    {/* <IconButton type="submit" aria-label="search">
      <SearchIcon style={{ fill: "blue" }} />
    </IconButton> */}
  </form>
);

const filterData = (query, inventory) => {
  if (!query) {
    return inventory;
  } else {
    return inventory.filter(({name}) => name.substring(0,query.length).toLowerCase().includes(query));
  }
};

export default function Home() {
  // useStates for creating and managing the inventory
  const [inventory, setInventory] = useState([])
  const [openAdd, setOpenAdd] = useState(false)
  const [openSearch, setOpenSearch] = useState(false)
  const [itemName, setItemName] = useState('')
  // useStates for search feature
  const [searchQuery, setSearchQuery] = useState("");
  const dataFiltered = filterData(searchQuery, inventory);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  // Add item modal
  const handleOpenAdd = () => setOpenAdd(true)
  const handleCloseAdd = () => setOpenAdd(false)

  // Search Modal
  const handleOpenSearch = () => setOpenSearch(true)
  const handleCloseSearch = () => setOpenSearch(false)
  
  useEffect(() => {
    updateInventory()
  }, [])

  return (
    <Box
    width="100vw"
    height="100vh"
    display={'flex'}
    justifyContent={'center'}
    flexDirection={'column'}
    alignItems={'center'}
    gap={2}
    sx={{
      backgroundImage: `url(https://t3.ftcdn.net/jpg/04/63/13/44/360_F_463134498_8VQb9uEoaSyrhgikdIUdp0D46zw7WTcN.jpg)`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",

    }}
  >
    <Box>
    <Button variant="contained" onClick={handleOpenSearch} gap={2}>
      Search
    </Button>
    <Button variant="contained" onClick={handleOpenAdd} gap={2}>
      Add New Item
    </Button>
    </Box>
    <Box border={'1px solid #333'}>
      <Box
        width="800px"
        height="100px"
        bgcolor={'#ADD8E6'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
          Inventory Items
        </Typography>
      </Box>
      <Stack width="800px" height="300px" divider={<Divider orientation="horizontal" flexItem />} overflow={'auto'}>
        {inventory.map(({name, quantity}) => (
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            bgcolor={'#f0f0f0'}
            paddingX={5}
          >
            <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
              Quantity: {quantity}
            </Typography>
            <Button variant="contained" onClick={() => removeItem(name)}>
              Remove
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
    <Box>
      <Modal
        open={openAdd}
        onClose={handleCloseAdd}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleCloseAdd()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Modal
        open={openSearch}
        onClose={handleCloseSearch}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <Box style={{ padding: 3 }}>
              {dataFiltered.map(({name, quantity}) => (
                <Box
                  className="text"
                  style={{
                    padding: 5,
                    justifyContent: "normal",
                    fontSize: 20,
                    color: "blue",
                    margin: 1,
                    width: "250px",
                    BorderColor: "green",
                    borderWidth: "10px"
                  }}
                  key={name.id}
                  >
                  {name.charAt(0).toUpperCase() + name.slice(1)}, {quantity}
                </Box>
              ))}
            </Box>
        </Box>
      </Modal>
    </Box>
  </Box>
  )
}