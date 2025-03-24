import { app, BrowserWindow, Menu } from 'electron'
import { ipcMainHandle, ipcMainOn, ipcWebContentsSend, isDev } from './util.js'
import { getStaticData, pollResources } from './resourceManager.js'
import { getAssetPath, getPreloadPath, getUIPath } from './pathResolver.js'
import { createTray } from './tray.js'
import { createMenu } from './menu.js'
import sqlite3 from 'sqlite3'
import path from 'path'

// Function to test SQLite connection
function testSQLiteConnection(mainWindow: any) {
  const dbPath = path.join(getAssetPath(), 'database.sqlite')
  // Create a new database connection to the file-based database
  let db = new sqlite3.Database(
    dbPath,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.error('Failed to connect to the database:', err.message)
        ipcWebContentsSend(
          'subscribeDatabaseStatus',
          mainWindow.webContents,
          'FAILURE',
        )
      } else {
        console.log('Connected to the SQLite database.')

        // Example: Create a table and insert data to test the connection
        db.serialize(() => {
          // Create a new table
          db.run(
            'CREATE TABLE IF NOT EXISTS test (id INT PRIMARY KEY, name TEXT)',
            (err) => {
              if (err) {
                console.error('Error creating table:', err.message)
                ipcWebContentsSend(
                  'subscribeDatabaseStatus',
                  mainWindow.webContents,
                  'FAILURE',
                )
                return
              }
              console.log('Table created or already exists.')
              ipcWebContentsSend(
                'subscribeDatabaseStatus',
                mainWindow.webContents,
                'SUCCESS',
              )
              // Insert data only if it doesn't already exist
              const insertQuery =
                "INSERT OR IGNORE INTO test (id, name) VALUES (1, 'John Doe'), (2, 'Jane Doe')"

              db.run(insertQuery, (err) => {
                if (err) {
                  console.error('Error inserting data:', err.message)
                  ipcWebContentsSend(
                    'subscribeDatabaseStatus',
                    mainWindow.webContents,
                    'FAILURE',
                  )
                  return
                }
                console.log('Data inserted successfully (if not existed).')
                // Query the data
                db.each(
                  'SELECT id, name FROM test',
                  (err, row: { id: string; name: string }) => {
                    if (err) {
                      console.error('Error querying data:', err.message)
                      return
                    }
                    console.log(`Id: ${row.id}, Name: ${row.name}`)
                  },
                )
                // Send success message to the renderer process after the test is complete
                ipcWebContentsSend(
                  'subscribeDatabaseStatus',
                  mainWindow.webContents,
                  'SUCCESS',
                )
              })
            },
          )
        })
      }
    },
  )
}

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },

    // disables default system frame (dont do this if you want a proper working menu bar)
    frame: false,
  })
  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(getUIPath())
  }

  pollResources(mainWindow)
  mainWindow.webContents.on('did-finish-load', () => {
    testSQLiteConnection(mainWindow);
  });

  ipcMainHandle('getStaticData', () => {
    return getStaticData()
  })

  ipcMainOn('sendFrameAction', (payload) => {
    switch (payload) {
      case 'CLOSE':
        mainWindow.close()
        break
      case 'MAXIMIZE':
        mainWindow.maximize()
        break
      case 'MINIMIZE':
        mainWindow.minimize()
        break
    }
  })

  createTray(mainWindow)
  handleCloseEvents(mainWindow)
  createMenu(mainWindow)
})

function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false

  mainWindow.on('close', (e) => {
    if (willClose) {
      return
    }
    e.preventDefault()
    mainWindow.hide()
    if (app.dock) {
      app.dock.hide()
    }
  })

  app.on('before-quit', () => {
    willClose = true
  })

  mainWindow.on('show', () => {
    willClose = false
  })
}
