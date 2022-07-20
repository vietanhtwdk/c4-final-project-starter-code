import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

// const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
const dbClient: DocumentClient = createDynamoDBClient()

const todoTable = process.env.TODOS_TABLE

export async function getTodoItemsByUser(userId: string): Promise<TodoItem[]> {
  logger.info('Getting all todos for user: ' + userId)

  const params: DocumentClient.QueryInput = {
    TableName: todoTable,
    IndexName: process.env.TODOS_CREATED_AT_INDEX,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }

  const result = await dbClient.query(params).promise()
  const todoItems = result.Items as TodoItem[]
  logger.info('Returning Todos: ' + todoItems)
  return todoItems
}

export async function createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
  const params: DocumentClient.PutItemInput = {
    TableName: todoTable,
    Item: todoItem
  }

  await dbClient.put(params).promise()
  return todoItem
}

export async function updateTodoItem(
  todoId: string,
  userId: string,
  todoUpdate: TodoUpdate
): Promise<TodoItem> {
  const params: DocumentClient.UpdateItemInput = {
    TableName: todoTable,
    Key: {
      userId: userId,
      todoId: todoId
    },
    ExpressionAttributeNames: {
      '#N': 'name'
    },
    UpdateExpression: 'set #N = :todoName, dueDate = :dueDate, done = :done',
    ExpressionAttributeValues: {
      ':todoName': todoUpdate.name,
      ':dueDate': todoUpdate.dueDate,
      ':done': todoUpdate.done
    },
    ReturnValues: 'ALL_NEW'
  }

  const updatedItem = await dbClient.update(params).promise()
  return updatedItem.Attributes as TodoItem
}

export async function deleteTodoItem(
  todoId: string,
  userId: string
): Promise<void> {
  const params: DocumentClient.DeleteItemInput = {
    TableName: todoTable,
    Key: {
      userId: userId,
      todoId: todoId
    }
  }

  await dbClient.delete(params).promise()
}

export async function updateAttachmentUrl(
  todoId: string,
  userId: string,
  attachmentUrl: string
): Promise<void> {
  await dbClient
    .update({
      TableName: todoTable,
      Key: {
        userId,
        todoId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      }
    })
    .promise()
}

function createDynamoDBClient(): DocumentClient {
  // XAWS.DynamoDB.DocumentClient() error
  const service = new AWS.DynamoDB()
  const client = new AWS.DynamoDB.DocumentClient({
    service: service
  })
  AWSXRay.captureAWSClient(service)
  return client
}
